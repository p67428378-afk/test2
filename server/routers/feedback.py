import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Feedback, SentimentAnalysis, FeedbackTopic
from server.schemas import FeedbackResponse
from server.ai_service import analyze_sentiment_and_topics
from server.alert_service import trigger_critical_feedback_alert

router = APIRouter(prefix="/feedback", tags=["Feedback Ingestion"])


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(payload: dict = Body(...), db: Session = Depends(get_db)):
    # Explicit validation to guarantee 400 Bad Request on invalid fields
    rating = payload.get("rating")
    feedback_text = payload.get("feedback_text")
    customer_email = payload.get("customer_email")
    category = payload.get("category")

    if rating is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required field: rating",
        )

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5",
        )

    if feedback_text is None or not str(feedback_text).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback text cannot be empty",
        )

    feedback_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    # 1. Create Feedback record
    feedback = Feedback(
        id=feedback_id,
        rating=rating,
        feedback_text=str(feedback_text).strip(),
        customer_email=str(customer_email).strip() if customer_email else None,
        category=str(category).strip() if category else None,
        status="Processed",
        created_at=now,
        updated_at=now,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    # 2. Run AI Sentiment Analysis & Topic Categorization
    try:
        ai_result = analyze_sentiment_and_topics(
            feedback.feedback_text, feedback.rating
        )
        sentiment_rec = SentimentAnalysis(
            id=str(uuid.uuid4()),
            feedback_id=feedback.id,
            sentiment=ai_result["sentiment"],
            confidence_score=ai_result["confidence_score"],
            summary=ai_result["summary"],
            created_at=now,
        )
        db.add(sentiment_rec)

        for topic in ai_result["topics"]:
            topic_rec = FeedbackTopic(
                id=str(uuid.uuid4()),
                feedback_id=feedback.id,
                topic_name=topic["topic_name"],
                sentiment=topic["sentiment"],
                created_at=now,
            )
            db.add(topic_rec)
        db.commit()
    except Exception:
        # If AI analysis fails, set status to Pending Analysis without failing user submission
        feedback.status = "Pending Analysis"
        db.commit()

    # 3. Trigger Real-Time Automated Alerting for Critical Negative Feedback
    sentiment_val = feedback.sentiment.sentiment if feedback.sentiment else "Neutral"
    trigger_critical_feedback_alert(db, feedback, sentiment_val)

    db.refresh(feedback)
    return feedback


@router.get("/{id}", response_model=FeedbackResponse)
def get_feedback_by_id(id: str, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.id == id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feedback record with id '{id}' was not found.",
        )
    return feedback
