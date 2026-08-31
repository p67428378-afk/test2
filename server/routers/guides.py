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
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Guide)
    if search:
        query = query.filter(
            Guide.name.ilike(f"%{search}%") | Guide.specialization.ilike(f"%{search}%")
        )
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=GuideResponse, status_code=status.HTTP_201_CREATED)
def create_guide(
    guide_in: GuideCreate,
    db: Session = Depends(get_db),
):
    existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guide with email '{guide_in.email}' already exists",
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
def get_guide(
    guide_id: str,
    db: Session = Depends(get_db),
):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{guide_id}' not found",
        )
    return guide
