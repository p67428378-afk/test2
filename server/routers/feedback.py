from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Feedback
from server.schemas import FeedbackCreate, FeedbackResponse, FeedbackCreateResponse
from server.services import process_feedback_record

router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])


@router.post(
    "", response_model=FeedbackCreateResponse, status_code=status.HTTP_201_CREATED
)
def submit_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
):
    if not feedback_in.feedback_text or not feedback_in.feedback_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback text cannot be empty",
        )

    if feedback_in.rating < 1 or feedback_in.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5",
        )

    # Ingest feedback record
    feedback = Feedback(
        feedback_text=feedback_in.feedback_text.strip(),
        rating=feedback_in.rating,
        customer_email=feedback_in.customer_email.strip()
        if feedback_in.customer_email
        else None,
        analysis_status="Analyzed",
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    # Process AI sentiment analysis and extract topics
    process_feedback_record(db, feedback.id)
    db.refresh(feedback)

    return feedback


@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_feedback_by_id(
    feedback_id: str,
    db: Session = Depends(get_db),
):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feedback with ID {feedback_id} not found",
        )
    return feedback
