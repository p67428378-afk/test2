from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import ReviewResponse, ReviewCreate
from server import crud

router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews & Ratings"])


@router.get("", response_model=List[ReviewResponse])
def get_reviews(
    response: Response,
    place_id: Optional[str] = Query(None, description="Filter reviews by place_id"),
    db: Session = Depends(get_db),
):
    """Fetch traveler reviews, optionally filtered by place_id."""
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    if not place_id:
        return []
    return crud.get_reviews_by_place(db, place_id)


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """Submit a star rating (1-5) and textual feedback for a tourist place."""
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Rating must be an integer between 1 and 5 stars",
        )

    place = crud.get_tourist_place(db, review.place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tourist place with ID '{review.place_id}' not found",
        )

    return crud.create_review(db, review)
