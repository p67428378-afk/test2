from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Guide, Review
from server.schemas import (
    GuideCreate,
    GuideUpdate,
    GuideResponse,
    GuideMetricsResponse,
)

router = APIRouter(prefix="/api/v1/guides", tags=["Guides"])


@router.get("", response_model=List[GuideResponse])
def get_guides(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    guides = db.query(Guide).offset(skip).limit(limit).all()
    return guides


@router.get("/{guide_id}", response_model=GuideResponse)
def get_guide(guide_id: str, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )
    return guide


@router.post("", response_model=GuideResponse, status_code=status.HTTP_201_CREATED)
def create_guide(guide_in: GuideCreate, db: Session = Depends(get_db)):
    existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A guide with this email already exists",
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


@router.put("/{guide_id}", response_model=GuideResponse)
def update_guide(guide_id: str, guide_in: GuideUpdate, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )
    if guide_in.name is not None:
        guide.name = guide_in.name
    if guide_in.email is not None:
        if guide_in.email != guide.email:
            existing = db.query(Guide).filter(Guide.email == guide_in.email).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A guide with this email already exists",
                )
        guide.email = guide_in.email
    if guide_in.specialization is not None:
        guide.specialization = guide_in.specialization
    db.commit()
    db.refresh(guide)
    return guide


@router.delete("/{guide_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guide(guide_id: str, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )
    db.delete(guide)
    db.commit()
    return None


@router.get("/{guide_id}/metrics", response_model=GuideMetricsResponse)
def get_guide_metrics(guide_id: str, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )

    reviews = (
        db.query(Review)
        .filter(Review.guide_id == guide_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    total_reviews = len(reviews)
    breakdown = {"1_star": 0, "2_star": 0, "3_star": 0, "4_star": 0, "5_star": 0}
    recent_comments = []
    total_score = 0

    for r in reviews:
        if 1 <= r.rating <= 5:
            key = f"{r.rating}_star"
            breakdown[key] = breakdown.get(key, 0) + 1
            total_score += r.rating
        if r.comment:
            recent_comments.append(r.comment)

    avg_rating = round(total_score / total_reviews, 2) if total_reviews > 0 else 0.0

    return GuideMetricsResponse(
        guide_id=guide.id,
        guide_name=guide.name,
        average_rating=avg_rating,
        total_reviews=total_reviews,
        rating_breakdown=breakdown,
        recent_comments=recent_comments[:10],
    )
