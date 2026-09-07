import io
import csv
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import User, Feedback, SentimentAnalysis, FeedbackTopic, Alert
from server.schemas import (
    InsightsResponse,
    SentimentDistribution,
    TopTopicItem,
    TrendDataPoint,
    FeedbackListResponse,
    AlertResponse,
)
from server.auth import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Insights & Analytics"])


def parse_timeframe_days(timeframe: str) -> int:
    if timeframe == "7d":
        return 7
    elif timeframe == "90d":
        return 90
    return 30  # default 30d


@router.get("/insights", response_model=InsightsResponse)
def get_insights(
    timeframe: str = Query("30d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    days = parse_timeframe_days(timeframe)
    start_date = datetime.now(timezone.utc) - timedelta(days=days)

    # Base query for timeframe
    query = db.query(Feedback).filter(Feedback.created_at >= start_date)
    all_feedbacks = query.all()
    total_feedback = len(all_feedbacks)

    if total_feedback == 0:
        return InsightsResponse(
            total_feedback=0,
            avg_rating=0.0,
            sentiment_distribution=SentimentDistribution(
                positive=0,
                neutral=0,
                negative=0,
                positive_percentage=0.0,
                neutral_percentage=0.0,
                negative_percentage=0.0,
            ),
            top_topics=[],
            historical_trends=[],
        )

    # Average rating
    avg_rating = sum(f.rating for f in all_feedbacks) / total_feedback

    # Sentiment distribution
    pos_count = sum(
        1 for f in all_feedbacks if f.sentiment and f.sentiment.sentiment == "Positive"
    )
    neu_count = sum(
        1 for f in all_feedbacks if f.sentiment and f.sentiment.sentiment == "Neutral"
    )
    neg_count = sum(
        1 for f in all_feedbacks if f.sentiment and f.sentiment.sentiment == "Negative"
    )

    distribution = SentimentDistribution(
        positive=pos_count,
        neutral=neu_count,
        negative=neg_count,
        positive_percentage=round((pos_count / total_feedback) * 100, 1),
        neutral_percentage=round((neu_count / total_feedback) * 100, 1),
        negative_percentage=round((neg_count / total_feedback) * 100, 1),
    )

    # Top Topics
    feedback_ids = [f.id for f in all_feedbacks]
    topics = (
        db.query(FeedbackTopic)
        .filter(FeedbackTopic.feedback_id.in_(feedback_ids))
        .all()
        if feedback_ids
        else []
    )

    topic_counts = {}
    topic_sentiments = {}
    for t in topics:
        topic_counts[t.topic_name] = topic_counts.get(t.topic_name, 0) + 1
        if t.topic_name not in topic_sentiments:
            topic_sentiments[t.topic_name] = []
        topic_sentiments[t.topic_name].append(t.sentiment)

    sorted_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)
    top_topics_list: List[TopTopicItem] = []
    for name, count in sorted_topics[:10]:
        sentiments = topic_sentiments.get(name, ["Neutral"])
        dominant_sentiment = max(set(sentiments), key=sentiments.count)
        top_topics_list.append(
            TopTopicItem(
                name=name,
                count=count,
                percentage=round((count / max(1, len(topics))) * 100, 1),
                sentiment=dominant_sentiment,
            )
        )

    # Historical trends grouped by date
    daily_buckets = {}
    for f in all_feedbacks:
        date_str = f.created_at.strftime("%Y-%m-%d")
        if date_str not in daily_buckets:
            daily_buckets[date_str] = {"ratings": [], "pos": 0, "neu": 0, "neg": 0}
        daily_buckets[date_str]["ratings"].append(f.rating)
        if f.sentiment:
            if f.sentiment.sentiment == "Positive":
                daily_buckets[date_str]["pos"] += 1
            elif f.sentiment.sentiment == "Negative":
                daily_buckets[date_str]["neg"] += 1
            else:
                daily_buckets[date_str]["neu"] += 1

    historical_trends: List[TrendDataPoint] = []
    for date_k in sorted(daily_buckets.keys()):
        data = daily_buckets[date_k]
        avg_r = sum(data["ratings"]) / max(1, len(data["ratings"]))
        historical_trends.append(
            TrendDataPoint(
                date=date_k,
                positive=data["pos"],
                neutral=data["neu"],
                negative=data["neg"],
                avg_rating=round(avg_r, 2),
            )
        )

    return InsightsResponse(
        total_feedback=total_feedback,
        avg_rating=round(avg_rating, 2),
        sentiment_distribution=distribution,
        top_topics=top_topics_list,
        historical_trends=historical_trends,
    )


@router.get("/feedback", response_model=FeedbackListResponse)
def list_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sentiment: Optional[str] = None,
    rating: Optional[int] = Query(None, ge=1, le=5),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    query = db.query(Feedback)

    if rating is not None:
        query = query.filter(Feedback.rating == rating)

    if category:
        query = query.filter(Feedback.category.ilike(f"%{category}%"))

    if search:
        query = query.filter(
            or_(
                Feedback.feedback_text.ilike(f"%{search}%"),
                Feedback.customer_email.ilike(f"%{search}%"),
            )
        )

    if sentiment:
        query = query.join(Feedback.sentiment).filter(
            SentimentAnalysis.sentiment.ilike(sentiment)
        )

    total = query.count()
    items = query.order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()

    return FeedbackListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/alerts", response_model=List[AlertResponse])
def list_alerts(
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    query = db.query(Alert)
    if status_filter:
        query = query.filter(Alert.status == status_filter.upper())
    alerts = query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()
    return alerts


@router.get("/export")
def export_feedback_csv(
    timeframe: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    sentiment: Optional[str] = None,
    rating: Optional[int] = Query(None, ge=1, le=5),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    query = db.query(Feedback)

    if timeframe != "all":
        days = parse_timeframe_days(timeframe)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        query = query.filter(Feedback.created_at >= start_date)

    if rating is not None:
        query = query.filter(Feedback.rating == rating)

    if category:
        query = query.filter(Feedback.category.ilike(f"%{category}%"))

    if sentiment:
        query = query.join(Feedback.sentiment).filter(
            SentimentAnalysis.sentiment.ilike(sentiment)
        )

    total_count = query.count()

    # If records > 10,000, indicate async batch export response
    if total_count > 10000:
        return {
            "status": "BATCH_GENERATION_QUEUED",
            "message": f"Export of {total_count} records exceeds 10,000 threshold. Batch file generation has been scheduled.",
            "download_link": f"/api/v1/admin/export/download/batch_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv",
        }

    records = query.order_by(Feedback.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "id",
            "created_at",
            "rating",
            "sentiment",
            "topic",
            "customer_email",
            "category",
            "feedback_text",
        ]
    )

    for r in records:
        sent_val = r.sentiment.sentiment if r.sentiment else "Pending Analysis"
        top_topic = r.topics[0].topic_name if r.topics else "General Feedback"
        created_str = r.created_at.isoformat() if r.created_at else ""
        writer.writerow(
            [
                r.id,
                created_str,
                r.rating,
                sent_val,
                top_topic,
                r.customer_email or "",
                r.category or "",
                r.feedback_text,
            ]
        )

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=feedback_insights_export.csv"
        },
    )
