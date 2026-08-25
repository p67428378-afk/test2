import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.app.database import get_db
from server.app.models.film import Film
from server.app.models.rating import RatingEntry
from server.app.models.user import User
from server.app.routers import get_current_user
from server.app.schemas.rating import RatingCreate, RatingResponse, RatingDetailResponse

router = APIRouter(prefix="/ratings", tags=["ratings"])


@router.get("", response_model=List[RatingDetailResponse])
def get_ratings(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    ratings = db.query(RatingEntry).filter(RatingEntry.user_id == current_user.id).all()
    return ratings


@router.post("", response_model=RatingResponse)
def rate_film(
    payload: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if film exists
    film = db.query(Film).filter(Film.id == payload.film_id).first()
    if not film:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Film not found"
        )

    # Check if rating already exists (for update/upsert)
    existing = (
        db.query(RatingEntry)
        .filter(
            RatingEntry.user_id == current_user.id,
            RatingEntry.film_id == payload.film_id,
        )
        .first()
    )

    if existing:
        existing.rating = payload.rating
        db.commit()
        db.refresh(existing)
        return existing

    entry = RatingEntry(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        film_id=payload.film_id,
        rating=payload.rating,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{film_id}", status_code=status.HTTP_204_NO_CONTENT)
def clear_rating(
    film_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = (
        db.query(RatingEntry)
        .filter(RatingEntry.user_id == current_user.id, RatingEntry.film_id == film_id)
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found"
        )

    db.delete(entry)
    db.commit()
    return None
