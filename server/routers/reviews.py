from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from server.database import get_db
from server.models import Review, Booking, Attendance, Schedule
from server.schemas import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews"])


@router.get("", response_model=List[ReviewResponse])
def get_reviews(
    tour_id: Optional[str] = None,
    guide_id: Optional[str] = None,
    booking_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Review)
    if tour_id:
        query = query.filter(Review.tour_id == tour_id)
    if guide_id:
        query = query.filter(Review.guide_id == guide_id)
    if booking_id:
        query = query.filter(Review.booking_id == booking_id)
    reviews = query.order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    return reviews


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )
    return review


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    # 1. Rating bounds validation (1 to 5)
    if review_in.rating < 1 or review_in.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5",
        )

    # 2. Verify booking exists
    booking = db.query(Booking).filter(Booking.id == review_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    # 3. Attendance Verification Gate: Verify visitor has completed attendance
    attendance = (
        db.query(Attendance).filter(Attendance.booking_id == booking.id).first()
    )
    if not attendance and booking.booking_status != "ATTENDED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit review: Attendance record not found for this booking",
        )

    # 4. Duplicate Review Guard: Enforce single-review per booking
    existing_review = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback already submitted for this booking",
        )

    # 5. Resolve tour_id and guide_id from schedule
    schedule = db.query(Schedule).filter(Schedule.id == booking.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour schedule associated with booking not found",
        )

    tour_id = schedule.tour_id
    guide_id = schedule.guide_id

    review = Review(
        booking_id=booking.id,
        tour_id=tour_id,
        guide_id=guide_id,
        rating=review_in.rating,
        comment=review_in.comment,
    )

    try:
        db.add(review)
        db.commit()
        db.refresh(review)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback already submitted for this booking",
        )

    return review
