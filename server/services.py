import re
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import func
from sqlalchemy.orm import Session

from server.models import Feedback, SentimentAnalysis, FeedbackTopic


def analyze_feedback(feedback_text: str, rating: int) -> Dict[str, Any]:
    """
    AI Sentiment Analysis & Topic Extraction Engine.
    Processes feedback text and rating to classify sentiment and extract topics.
    """
    text_lower = feedback_text.lower()

    positive_keywords = [
        "great",
        "excellent",
        "love",
        "awesome",
        "super",
        "clean",
        "fast",
        "smooth",
        "helpful",
        "easy",
        "best",
        "satisfied",
        "resolved",
        "good",
        "nice",
        "perfect",
        "wonderful",
        "friendly",
        "prompt",
        "appreciated",
    ]
    negative_keywords = [
        "slow",
        "error",
        "bug",
        "fail",
        "broken",
        "checkout",
        "timed out",
        "delay",
        "terrible",
        "worst",
        "confusing",
        "hard",
        "crash",
        "bad",
        "issue",
        "problem",
        "stuck",
        "frustrating",
        "poor",
        "difficult",
        "horrible",
    ]

    pos_matches = sum(
        1
        for kw in positive_keywords
        if re.search(r"\b" + re.escape(kw) + r"\b", text_lower)
    )
    neg_matches = sum(
        1
        for kw in negative_keywords
        if re.search(r"\b" + re.escape(kw) + r"\b", text_lower)
    )

    # Determine sentiment and score
    if rating >= 4:
        if neg_matches > pos_matches + 1:
            sentiment = "Neutral"
            score = 0.60
        else:
            sentiment = "Positive"
            score = min(0.98, 0.75 + (rating - 3) * 0.1 + pos_matches * 0.03)
    elif rating <= 2:
        if pos_matches > neg_matches + 1:
            sentiment = "Neutral"
            score = 0.55
        else:
            sentiment = "Negative"
            score = min(0.98, 0.70 + (3 - rating) * 0.1 + neg_matches * 0.04)
    else:  # rating == 3
        if pos_matches > neg_matches:
            sentiment = "Positive"
            score = 0.65
        elif neg_matches > pos_matches:
            sentiment = "Negative"
            score = 0.68
        else:
            sentiment = "Neutral"
            score = 0.50

    # Extract Topics
    topic_keywords_map = {
        "UI Usability & Design": [
            "ui",
            "design",
            "layout",
            "interface",
            "button",
            "screen",
            "theme",
            "look",
            "visual",
            "navigation",
        ],
        "Payment Gateway Slowness": [
            "pay",
            "payment",
            "checkout",
            "credit card",
            "billing",
            "charge",
            "invoice",
            "transaction",
        ],
        "Customer Support Response": [
            "support",
            "help",
            "agent",
            "service",
            "ticket",
            "representative",
            "chat",
            "email response",
        ],
        "Feature Requests": [
            "feature",
            "export",
            "csv",
            "add",
            "request",
            "integration",
            "dark mode",
            "option",
            "ability",
        ],
        "Performance & Speed": [
            "slow",
            "fast",
            "speed",
            "latency",
            "load",
            "loading",
            "performance",
            "timeout",
            "timed out",
            "lag",
        ],
    }

    matched_topics: List[Dict[str, Any]] = []
    for topic_name, keywords in topic_keywords_map.items():
        count = sum(1 for kw in keywords if kw in text_lower)
        if count > 0:
            confidence = min(0.98, 0.70 + count * 0.08)
            matched_topics.append({"topic_name": topic_name, "confidence": confidence})

    if not matched_topics:
        # Default topic based on rating
        if rating >= 4:
            matched_topics.append(
                {"topic_name": "General Satisfaction", "confidence": 0.80}
            )
        elif rating <= 2:
            matched_topics.append(
                {"topic_name": "General Improvement", "confidence": 0.80}
            )
        else:
            matched_topics.append(
                {"topic_name": "General Feedback", "confidence": 0.75}
            )

    return {
        "sentiment": sentiment,
        "score": round(score, 2),
        "topics": matched_topics,
        "raw_response": f"Classified as {sentiment} with score {score:.2f} across {len(matched_topics)} topic(s)",
    }


def process_feedback_record(db: Session, feedback_id: str) -> bool:
    """
    Runs sentiment and topic analysis for a feedback record and persists findings.
    """
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        return False

    analysis_res = analyze_feedback(feedback.feedback_text, feedback.rating)

    # Sentiment analysis update or insert
    sa = (
        db.query(SentimentAnalysis)
        .filter(SentimentAnalysis.feedback_id == feedback.id)
        .first()
    )
    if not sa:
        sa = SentimentAnalysis(
            feedback_id=feedback.id,
            sentiment=analysis_res["sentiment"],
            score=analysis_res["score"],
            raw_llm_response=analysis_res["raw_response"],
        )
        db.add(sa)
    else:
        sa.sentiment = analysis_res["sentiment"]
        sa.score = analysis_res["score"]
        sa.raw_llm_response = analysis_res["raw_response"]
        sa.processed_at = datetime.now(timezone.utc)

    # Topics: remove old and insert new
    db.query(FeedbackTopic).filter(FeedbackTopic.feedback_id == feedback.id).delete()
    for topic_info in analysis_res["topics"]:
        tp = FeedbackTopic(
            feedback_id=feedback.id,
            topic_name=topic_info["topic_name"],
            confidence=topic_info["confidence"],
        )
        db.add(tp)

    feedback.analysis_status = "Analyzed"
    feedback.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(feedback)
    return True


def get_admin_insights_data(
    db: Session,
    days: Optional[int] = None,
    category: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Aggregates metrics for the admin insights dashboard.
    """
    query = db.query(Feedback)

    if days and days > 0:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        query = query.filter(Feedback.created_at >= cutoff)

    if category and category != "ALL":
        query = query.join(Feedback.topics).filter(FeedbackTopic.topic_name == category)

    feedback_records = query.all()
    total_feedback = len(feedback_records)

    if total_feedback == 0:
        return {
            "total_feedback": 0,
            "avg_rating": 0.0,
            "sentiment_distribution": {
                "positive": 0,
                "neutral": 0,
                "negative": 0,
                "positive_percentage": 0.0,
                "neutral_percentage": 0.0,
                "negative_percentage": 0.0,
            },
            "top_topics": [],
        }

    # Calculate avg rating
    avg_rating = round(sum(f.rating for f in feedback_records) / total_feedback, 1)

    # Calculate sentiment distribution
    pos_count = 0
    neu_count = 0
    neg_count = 0

    feedback_ids = [f.id for f in feedback_records]
    sentiment_records = (
        db.query(SentimentAnalysis)
        .filter(SentimentAnalysis.feedback_id.in_(feedback_ids))
        .all()
    )

    for sa in sentiment_records:
        if sa.sentiment == "Positive":
            pos_count += 1
        elif sa.sentiment == "Negative":
            neg_count += 1
        else:
            neu_count += 1

    analyzed_total = len(sentiment_records) or total_feedback
    pos_pct = (
        round((pos_count / analyzed_total) * 100, 1) if analyzed_total > 0 else 0.0
    )
    neu_pct = (
        round((neu_count / analyzed_total) * 100, 1) if analyzed_total > 0 else 0.0
    )
    neg_pct = (
        round((neg_count / analyzed_total) * 100, 1) if analyzed_total > 0 else 0.0
    )

    # Top topics aggregation
    topic_query = (
        db.query(FeedbackTopic.topic_name, func.count(FeedbackTopic.id).label("count"))
        .filter(FeedbackTopic.feedback_id.in_(feedback_ids))
        .group_by(FeedbackTopic.topic_name)
        .order_by(func.count(FeedbackTopic.id).desc())
        .limit(10)
        .all()
    )

    total_topic_mentions = sum(t.count for t in topic_query) if topic_query else 1
    top_topics = []

    for t_name, t_count in topic_query:
        # Determine sentiment for this topic
        top_sa = (
            db.query(SentimentAnalysis.sentiment, func.count(SentimentAnalysis.id))
            .join(Feedback, SentimentAnalysis.feedback_id == Feedback.id)
            .join(FeedbackTopic, FeedbackTopic.feedback_id == Feedback.id)
            .filter(FeedbackTopic.topic_name == t_name)
            .filter(Feedback.id.in_(feedback_ids))
            .group_by(SentimentAnalysis.sentiment)
            .order_by(func.count(SentimentAnalysis.id).desc())
            .first()
        )
        topic_sentiment = top_sa[0] if top_sa else "Neutral"
        topic_pct = (
            round((t_count / total_topic_mentions) * 100, 1)
            if total_topic_mentions > 0
            else 0.0
        )

        top_topics.append(
            {
                "name": t_name,
                "count": t_count,
                "percentage": topic_pct,
                "sentiment": topic_sentiment,
            }
        )

    return {
        "total_feedback": total_feedback,
        "avg_rating": avg_rating,
        "sentiment_distribution": {
            "positive": pos_count,
            "neutral": neu_count,
            "negative": neg_count,
            "positive_percentage": pos_pct,
            "neutral_percentage": neu_pct,
            "negative_percentage": neg_pct,
        },
        "top_topics": top_topics,
    }
