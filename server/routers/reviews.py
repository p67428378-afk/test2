from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.review import Review
from server.models.session import Session as SessionModel
from server.models.user import User
from server.schemas.review import ReviewCreate, ReviewResponse
from server.dependencies.auth import require_role

router = APIRouter(prefix="/api/v1/reviews", tags=["reviews"])


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["REVIEWER", "ORGANIZER", "ADMIN"])),
):
    session_obj = (
        db.query(SessionModel).filter(SessionModel.id == review_in.session_id).first()
    )
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    review = Review(
        session_id=review_in.session_id,
        reviewer_id=current_user.id,
        score=review_in.score,
        comments=review_in.comments,
        decision=review_in.decision,
    )

    # Update session status based on decision
    if review_in.decision.upper() in ["APPROVED", "REJECTED"]:
        session_obj.status = review_in.decision.upper()
    else:
        session_obj.status = "UNDER_REVIEW"

    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/session/{session_id}", response_model=List[ReviewResponse])
def get_session_reviews(session_id: str, db: Session = Depends(get_db)):
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    reviews = db.query(Review).filter(Review.session_id == session_id).all()
    return reviews
