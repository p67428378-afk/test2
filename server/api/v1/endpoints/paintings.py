from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import PaintingOut, PaintingListResponse, FrameOptionOut

router = APIRouter()


@router.get("/paintings", response_model=PaintingListResponse)
def list_paintings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    style: Optional[str] = None,
    medium: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    is_configurable: Optional[bool] = None,
    is_original_one_of_one: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """
    Fetch catalog paintings with filtering, full-text search, and pagination.
    If search yields no results, returns popular suggestions.
    """
    query = db.query(models.Painting).filter(models.Painting.status == "ACTIVE")

    if style:
        query = query.filter(models.Painting.style.ilike(f"%{style}%"))
    if medium:
        query = query.filter(models.Painting.medium.ilike(f"%{medium}%"))
    if min_price is not None:
        query = query.filter(models.Painting.base_price >= min_price)
    if max_price is not None:
        query = query.filter(models.Painting.base_price <= max_price)
    if is_configurable is not None:
        query = query.filter(models.Painting.is_configurable == is_configurable)
    if is_original_one_of_one is not None:
        query = query.filter(
            models.Painting.is_original_one_of_one == is_original_one_of_one
        )

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Painting.title.ilike(search_term),
                models.Painting.description.ilike(search_term),
                models.Painting.artist_name.ilike(search_term),
                models.Painting.medium.ilike(search_term),
                models.Painting.style.ilike(search_term),
            )
        )

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    suggestions = None
    if total == 0 and search:
        # Fetch recommended/popular active paintings when search yields 0 results
        suggestions = (
            db.query(models.Painting)
            .filter(models.Painting.status == "ACTIVE")
            .limit(4)
            .all()
        )

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
        "suggestions": suggestions,
    }


@router.get("/paintings/{painting_id}", response_model=PaintingOut)
def get_painting_detail(painting_id: UUID, db: Session = Depends(get_db)):
    """
    Get detailed information for a specific painting.
    """
    painting = (
        db.query(models.Painting).filter(models.Painting.id == painting_id).first()
    )
    if not painting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Painting not found",
        )
    return painting


@router.get("/frame-options", response_model=List[FrameOptionOut])
def list_frame_options(db: Session = Depends(get_db)):
    """
    Get all available frame options.
    """
    return db.query(models.FrameOption).all()
