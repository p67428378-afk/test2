from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Recommendation, RecommendationFeedback
from server.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_200_OK)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
):
    if payload.feedback not in ["like", "dislike"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="feedback must be either 'like' or 'dislike'",
        )

    rec = (
        db.query(Recommendation)
        .filter(Recommendation.id == payload.recommendation_id)
        .first()
    )
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with id '{payload.recommendation_id}' not found",
        )

    existing_fb = (
        db.query(RecommendationFeedback)
        .filter(
            RecommendationFeedback.recommendation_id == payload.recommendation_id,
            RecommendationFeedback.user_id == payload.user_id,
        )
        .first()
    )

    if existing_fb:
        existing_fb.feedback = payload.feedback
        db.commit()
        db.refresh(existing_fb)
        return {
            "id": existing_fb.id,
            "recommendation_id": existing_fb.recommendation_id,
            "feedback": existing_fb.feedback,
            "status": "updated",
        }
    else:
        new_fb = RecommendationFeedback(
            recommendation_id=payload.recommendation_id,
            user_id=payload.user_id,
            feedback=payload.feedback,
        )
        db.add(new_fb)
        db.commit()
        db.refresh(new_fb)
        return {
            "id": new_fb.id,
            "recommendation_id": new_fb.recommendation_id,
            "feedback": new_fb.feedback,
            "status": "created",
        }
