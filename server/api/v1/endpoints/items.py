"""
Module: items
Purpose: Endpoints for listing items, retrieving item details, and placing bids.
"""

import asyncio
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from server import crud, schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user
from server.api.v1.endpoints.websocket import manager

router = APIRouter()


def run_async_task(coro):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(coro)
    except RuntimeError:
        try:
            asyncio.run(coro)
        except Exception:
            pass


@router.get("/items", response_model=schemas.ItemListResponse)
def list_items(
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    items, total = crud.get_items(db, skip=skip, limit=limit, status=status_filter)

    item_responses = []
    for item in items:
        auction_data = None
        if item.auction:
            # Check if auction has ended and update status if active
            now_utc = datetime.now(timezone.utc)
            end_time_aware = (
                item.auction.end_time.replace(tzinfo=timezone.utc)
                if item.auction.end_time.tzinfo is None
                else item.auction.end_time
            )
            if now_utc > end_time_aware and item.auction.status == "active":
                item.auction.status = "ended"
                db.commit()
                db.refresh(item.auction)

            auction_data = schemas.AuctionInItem(
                id=item.auction.id,
                current_highest_bid=float(item.auction.current_highest_bid)
                if item.auction.current_highest_bid is not None
                else None,
                end_time=item.auction.end_time,
                start_time=item.auction.start_time,
                starting_price=float(item.auction.starting_price),
                status=item.auction.status,
            )
        item_responses.append(
            schemas.ItemResponse(
                id=item.id,
                name=item.name,
                description=item.description,
                images=item.images or [],
                seller_id=item.seller_id,
                auction=auction_data,
            )
        )

    return schemas.ItemListResponse(items=item_responses, total=total)


@router.get("/items/{item_id}", response_model=schemas.ItemDetailResponse)
def get_item_detail(item_id: str, db: Session = Depends(get_db)):
    try:
        uuid_obj = uuid.UUID(item_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    item = (
        db.query(models.Item)
        .options(
            joinedload(models.Item.seller),
            joinedload(models.Item.auction)
            .joinedload(models.Auction.bids)
            .joinedload(models.Bid.user),
        )
        .filter(models.Item.id == uuid_obj)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    auction_detail = None
    if item.auction:
        # Check if auction has ended and update status if active
        now_utc = datetime.now(timezone.utc)
        end_time_aware = (
            item.auction.end_time.replace(tzinfo=timezone.utc)
            if item.auction.end_time.tzinfo is None
            else item.auction.end_time
        )
        if now_utc > end_time_aware and item.auction.status == "active":
            item.auction.status = "ended"
            db.commit()
            db.refresh(item.auction)

        sorted_bids = sorted(item.auction.bids, key=lambda b: b.amount, reverse=True)
        bids_data = [
            schemas.BidInAuction(
                id=bid.id,
                amount=float(bid.amount),
                created_at=bid.created_at,
                user_id=bid.user_id,
                user_name=bid.user.login_id,
            )
            for bid in sorted_bids
        ]

        # Determine winner if ended
        winner_id = None
        winner_name = None
        winner_instructions = None
        if item.auction.status == "ended" or now_utc > end_time_aware:
            if sorted_bids:
                winner_bid = sorted_bids[0]
                winner_id = winner_bid.user_id
                winner_name = winner_bid.user.login_id
                winner_instructions = f"Congratulations {winner_name}! You won the auction for '{item.name}' with a bid of ${winner_bid.amount:.2f}. Please contact the seller at {item.seller.login_id} to arrange payment and shipping."

        auction_detail = schemas.AuctionDetail(
            id=item.auction.id,
            current_highest_bid=float(item.auction.current_highest_bid)
            if item.auction.current_highest_bid is not None
            else None,
            end_time=item.auction.end_time,
            start_time=item.auction.start_time,
            starting_price=float(item.auction.starting_price),
            status=item.auction.status,
            bids=bids_data,
            winner_id=winner_id,
            winner_name=winner_name,
            winner_instructions=winner_instructions,
        )

    return schemas.ItemDetailResponse(
        id=item.id,
        name=item.name,
        description=item.description,
        images=item.images or [],
        seller_id=item.seller_id,
        seller_name=item.seller.login_id,
        auction=auction_detail,
    )


@router.post("/items/{item_id}/bid", response_model=schemas.PlaceBidResponse)
def place_bid(
    item_id: str,
    request: schemas.PlaceBidRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
        uuid_obj = uuid.UUID(item_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item or active auction not found",
        )

    item = crud.get_item_by_id(db, item_id=uuid_obj)
    if not item or not item.auction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item or active auction not found",
        )

    auction = item.auction

    now_utc = datetime.now(timezone.utc)
    end_time_aware = (
        auction.end_time.replace(tzinfo=timezone.utc)
        if auction.end_time.tzinfo is None
        else auction.end_time
    )
    if now_utc > end_time_aware or auction.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Auction has already ended"
        )

    if auction.current_highest_bid is not None:
        min_required = float(auction.current_highest_bid) + 10.0
        if request.amount < min_required:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bid amount must be higher than current highest bid by at least $10",
            )
    else:
        if request.amount < float(auction.starting_price):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Bid amount must be at least the starting price of ${auction.starting_price}",
            )

    previous_highest_bid = (
        db.query(models.Bid)
        .filter(models.Bid.auction_id == auction.id)
        .order_by(models.Bid.amount.desc())
        .first()
    )

    db_bid = crud.create_bid(
        db, auction_id=auction.id, user_id=current_user.id, amount=request.amount
    )

    run_async_task(
        manager.broadcast(
            str(item_id),
            {
                "event": "new_bid",
                "data": {
                    "amount": float(db_bid.amount),
                    "auction_id": str(db_bid.auction_id),
                    "created_at": db_bid.created_at.isoformat(),
                    "id": str(db_bid.id),
                    "user_id": str(db_bid.user_id),
                    "user_name": current_user.login_id,
                },
            },
        )
    )

    if previous_highest_bid and previous_highest_bid.user_id != current_user.id:
        run_async_task(
            manager.broadcast(
                str(item_id),
                {
                    "event": "outbid",
                    "data": {
                        "user_id": str(previous_highest_bid.user_id),
                        "item_id": str(item_id),
                        "item_name": item.name,
                        "new_highest_bid": float(request.amount),
                    },
                },
            )
        )

    return db_bid
