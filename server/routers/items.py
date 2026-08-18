import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Item, ItemImage, MatchSuggestion
from server.schemas import (
    ItemCreate,
    ItemResponse,
    ItemListResponse,
    MatchSuggestionResponse,
)
from server.auth import get_current_user
from server.services.ai_matcher import generate_match_suggestions

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/items", tags=["items"])


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Set default status based on type
    default_status = "REPORTED_LOST" if item_in.type == "lost" else "AVAILABLE_FOUND"

    db_item = Item(
        user_id=current_user.id,
        type=item_in.type,
        category=item_in.category,
        description=item_in.description,
        location=item_in.location,
        item_timestamp=item_in.item_timestamp,
        status=default_status,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # Handle images and validate file types
    for img_url in item_in.images:
        # Validate image extension
        ext = img_url.split(".")[-1].lower() if "." in img_url else ""
        if ext not in ["jpg", "jpeg", "png"]:
            logger.warning(f"Invalid image file type or upload failure for: {img_url}")
            # Accept the text report and log the image error without blocking item creation
            continue

        db_image = ItemImage(item_id=db_item.id, image_url=img_url)
        db.add(db_image)

    db.commit()
    db.refresh(db_item)

    # Automatically trigger AI match calculation
    generate_match_suggestions(db, db_item)

    return db_item


@router.get("", response_model=ItemListResponse)
def list_items(
    type: Optional[str] = Query(None, description="Filter by type ('lost' or 'found')"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Item)
    if type:
        query = query.filter(Item.type == type)
    if category:
        query = query.filter(Item.category == category)
    if status:
        query = query.filter(Item.status == status)

    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()

    return {"items": items, "total": total}


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.get("/{item_id}/matches", response_model=list[MatchSuggestionResponse])
def get_item_matches(item_id: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if item.type == "lost":
        suggestions = (
            db.query(MatchSuggestion)
            .filter(
                MatchSuggestion.lost_item_id == item_id,
                MatchSuggestion.confidence_score >= 50.0,
            )
            .all()
        )
    else:
        suggestions = (
            db.query(MatchSuggestion)
            .filter(
                MatchSuggestion.found_item_id == item_id,
                MatchSuggestion.confidence_score >= 50.0,
            )
            .all()
        )

    # Populate matched_item field dynamically
    results = []
    for sug in suggestions:
        matched_item = (
            db.query(Item)
            .filter(
                Item.id
                == (sug.found_item_id if item.type == "lost" else sug.lost_item_id)
            )
            .first()
        )
        if matched_item:
            sug.matched_item = matched_item
            results.append(sug)

    return results
