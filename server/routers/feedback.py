"""Recommendation feedback endpoints."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Recommendation, RecommendationFeedback
from server.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter()


@router.post(
    "/feedback", response_model=FeedbackResponse, status_code=status.HTTP_200_OK
)
def submit_recommendation_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
):
    """
    Submit positive/negative ('like'/'dislike') feedback on a recommended product.
    Updates existing feedback if already submitted for the same recommendation.
    """
    feedback_clean = payload.feedback.strip().lower()
    if feedback_clean not in ["like", "dislike"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback must be either 'like' or 'dislike'",
        )

    # Verify recommendation exists
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.id == payload.recommendation_id)
        .first()
    )
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with id {payload.recommendation_id} not found",
        )

    # Find existing feedback or create new
    fb = (
        db.query(RecommendationFeedback)
        .filter(
            RecommendationFeedback.recommendation_id == payload.recommendation_id,
            RecommendationFeedback.user_id == payload.user_id,
        )
        .first()
    )

    if fb:
        fb.feedback = feedback_clean
        fb.updated_at = datetime.now(timezone.utc)
    else:
        fb = RecommendationFeedback(
            recommendation_id=payload.recommendation_id,
            user_id=payload.user_id,
            feedback=feedback_clean,
        )
        db.add(fb)

    db.commit()
    db.refresh(fb)

    return FeedbackResponse(
        id=fb.id,
        recommendation_id=fb.recommendation_id,
        feedback=fb.feedback,
        status="updated",
    )
