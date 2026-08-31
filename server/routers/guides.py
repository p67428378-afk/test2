"""Tour Guide management endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Guide
from server.schemas import GuideCreate, GuideResponse

router = APIRouter(prefix="/api/v1/guides", tags=["Guides"])


@router.get("", response_model=List[GuideResponse])
def list_guides(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    db: Session = Depends(get_db),
):
    """List registered museum tour guides."""
    query = db.query(Guide)
    if specialization:
        query = query.filter(Guide.specialization.ilike(f"%{specialization}%"))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=GuideResponse, status_code=status.HTTP_201_CREATED)
def create_guide(
    guide_in: GuideCreate,
    db: Session = Depends(get_db),
):
    """Register a new museum tour guide."""
    existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A guide with this email already exists."
        )

    guide = Guide(
        name=guide_in.name,
        email=guide_in.email,
        specialization=guide_in.specialization,
    )
    db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide


@router.get("/{id}", response_model=GuideResponse)
def get_guide(
    id: str,
    db: Session = Depends(get_db),
):
    """Get guide profile by ID."""
    guide = db.query(Guide).filter(Guide.id == id).first()
    if not guide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found")
    return guide
