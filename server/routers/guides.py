from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Guide
from server.schemas import GuideCreate, GuideResponse, GuideUpdate

router = APIRouter(prefix="/api/v1/guides", tags=["Guides"])


@router.get("", response_model=List[GuideResponse])
def list_guides(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List registered museum tour guides."""
    guides = db.query(Guide).order_by(Guide.name).offset(skip).limit(limit).all()
    return guides


@router.post("", response_model=GuideResponse, status_code=status.HTTP_201_CREATED)
def create_guide(guide_in: GuideCreate, db: Session = Depends(get_db)):
    """Register a new tour guide."""
    existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guide with email '{guide_in.email}' already exists.",
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


@router.get("/{guide_id}", response_model=GuideResponse)
def get_guide(guide_id: str, db: Session = Depends(get_db)):
    """Retrieve guide profile by ID."""
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{guide_id}' not found",
        )
    return guide


@router.put("/{guide_id}", response_model=GuideResponse)
def update_guide(guide_id: str, guide_in: GuideUpdate, db: Session = Depends(get_db)):
    """Update guide details."""
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{guide_id}' not found",
        )

    if guide_in.email is not None and guide_in.email != guide.email:
        existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{guide_in.email}' is already in use by another guide.",
            )
        guide.email = guide_in.email

    if guide_in.name is not None:
        guide.name = guide_in.name
    if guide_in.specialization is not None:
        guide.specialization = guide_in.specialization

    db.commit()
    db.refresh(guide)
    return guide


@router.delete("/{guide_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guide(guide_id: str, db: Session = Depends(get_db)):
    """Delete a guide profile."""
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{guide_id}' not found",
        )
    db.delete(guide)
    db.commit()
    return None
