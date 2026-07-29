from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from server.database import get_db
from server.models import Item, User, ItemImage
from server.schemas import (
    ItemCreate,
    ItemResponse,
    FoundItemsResponse,
    AIMatchesResponse,
)
from server.auth import get_current_user
from server.ai_matching import find_matches_for_lost_item

router = APIRouter()


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate status
    if item_in.status not in ["reported_lost", "reported_found"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Status must be 'reported_lost' or 'reported_found'",
        )

    new_item = Item(
        user_id=current_user.id,
        name=item_in.name,
        description=item_in.description,
        category=item_in.category,
        location_text=item_in.location_text,
        lat=item_in.lat,
        lon=item_in.lon,
        status=item_in.status,
        item_date=item_in.item_date,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    # If image_url is provided, create ItemImage
    if item_in.image_url:
        new_image = ItemImage(item_id=new_item.id, image_url=item_in.image_url)
        db.add(new_image)
        db.commit()
        db.refresh(new_item)

    return new_item


@router.get("/found", response_model=FoundItemsResponse)
def get_found_items(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Item).filter(Item.status == "reported_found")

    if category:
        query = query.filter(Item.category.ilike(category))

    if search:
        query = query.filter(
            (Item.name.ilike(f"%{search}%"))
            | (Item.description.ilike(f"%{search}%"))
            | (Item.location_text.ilike(f"%{search}%"))
        )

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {"items": items, "total": total}


@router.get("/lost/{item_id}/matches", response_model=AIMatchesResponse)
def get_lost_item_matches(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get the lost item
    lost_item = db.query(Item).filter(Item.id == item_id).first()
    if not lost_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if lost_item.status != "reported_lost":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item is not reported as lost",
        )

    matches = find_matches_for_lost_item(lost_item, db)
    return {"matches": matches}
