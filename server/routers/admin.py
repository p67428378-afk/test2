from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, Feedback, SentimentAnalysis, FeedbackTopic
from server.schemas import (
    AdminInsightsResponse,
    AdminFeedbackListResponse,
    FeedbackResponse,
)
from server.auth import get_current_admin_user
from server.services import get_admin_insights_data, process_feedback_record

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Insights"])


@router.get("/insights", response_model=AdminInsightsResponse)
def get_insights(
    days: Optional[int] = Query(None, description="Filter insights by past N days"),
    category: Optional[str] = Query(
        None, description="Filter insights by topic category"
    ),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    insights = get_admin_insights_data(db, days=days, category=category)
    return insights


@router.get("/feedback", response_model=AdminFeedbackListResponse)
def list_admin_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sentiment: Optional[str] = Query(
        None, description="Filter by sentiment: Positive, Neutral, Negative"
    ),
    category: Optional[str] = Query(None, description="Filter by topic category"),
    search: Optional[str] = Query(
        None, description="Search feedback text or customer email"
    ),
    rating: Optional[int] = Query(None, ge=1, le=5),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(Feedback)

    if rating is not None:
        query = query.filter(Feedback.rating == rating)

    if sentiment and sentiment.upper() != "ALL":
        query = query.join(Feedback.sentiment_analysis).filter(
            SentimentAnalysis.sentiment == sentiment
        )

    if category and category.upper() != "ALL":
        query = query.join(Feedback.topics).filter(FeedbackTopic.topic_name == category)

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Feedback.feedback_text.ilike(search_pattern),
                Feedback.customer_email.ilike(search_pattern),
            )
        )

    total = query.distinct().count()
    items = query.order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()

    return AdminFeedbackListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("/feedback/{feedback_id}/reanalyze", response_model=FeedbackResponse)
def reanalyze_feedback(
    feedback_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feedback with ID {feedback_id} not found",
        )

    success = process_feedback_record(db, feedback.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reanalyze feedback",
        )

    db.refresh(feedback)
    return feedback
