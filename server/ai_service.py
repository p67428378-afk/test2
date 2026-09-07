import re
from typing import Dict, Any, List


def analyze_sentiment_and_topics(feedback_text: str, rating: int) -> Dict[str, Any]:
    """
    Simulates AI sentiment analysis and common issue categorization pipeline.
    Deterministic, robust natural language heuristic with confidence scoring.
    """
    text_lower = feedback_text.lower()

    # Keyword bags
    positive_words = {
        "great",
        "excellent",
        "love",
        "awesome",
        "fast",
        "easy",
        "clean",
        "good",
        "helpful",
        "perfect",
        "resolved",
        "improved",
        "best",
        "super",
        "happy",
    }
    negative_words = {
        "slow",
        "bad",
        "terrible",
        "crash",
        "failed",
        "error",
        "bug",
        "issue",
        "poor",
        "difficult",
        "confusing",
        "hate",
        "stuck",
        "timeout",
        "broke",
        "worst",
    }

    pos_count = sum(
        1 for w in positive_words if re.search(r"\b" + re.escape(w) + r"\b", text_lower)
    )
    neg_count = sum(
        1 for w in negative_words if re.search(r"\b" + re.escape(w) + r"\b", text_lower)
    )

    # Determine sentiment based on rating and keyword signals
    if rating >= 4:
        if neg_count > pos_count + 1 and rating == 4:
            sentiment = "Neutral"
            confidence = 0.78
        else:
            sentiment = "Positive"
            confidence = min(0.99, 0.85 + (pos_count * 0.03))
    elif rating <= 2:
        sentiment = "Negative"
        confidence = min(0.99, 0.88 + (neg_count * 0.03))
    else:  # rating == 3
        if pos_count > neg_count:
            sentiment = "Positive"
            confidence = 0.75
        elif neg_count > pos_count:
            sentiment = "Negative"
            confidence = 0.75
        else:
            sentiment = "Neutral"
            confidence = 0.85

    # Extract common topic categories
    topics: List[Dict[str, str]] = []

    topic_patterns = [
        (
            "Payment Processing",
            [
                "payment",
                "checkout",
                "credit card",
                "billing",
                "charge",
                "refund",
                "transaction",
                "pay",
            ],
        ),
        (
            "UI Usability & Design",
            [
                "ui",
                "ux",
                "layout",
                "design",
                "interface",
                "button",
                "navigation",
                "theme",
                "screen",
                "mobile",
            ],
        ),
        (
            "Customer Support Response",
            [
                "support",
                "agent",
                "service",
                "help",
                "representative",
                "contact",
                "chat",
                "email",
            ],
        ),
        (
            "Performance & Stability",
            [
                "crash",
                "slow",
                "timeout",
                "speed",
                "latency",
                "load",
                "freeze",
                "down",
                "performance",
            ],
        ),
        (
            "Feature Requests",
            [
                "feature",
                "request",
                "export",
                "csv",
                "add",
                "option",
                "integrate",
                "enhancement",
                "wish",
            ],
        ),
    ]

    for topic_name, keywords in topic_patterns:
        if any(re.search(r"\b" + re.escape(kw) + r"\b", text_lower) for kw in keywords):
            # Infer sentiment for this specific topic
            topic_sentiment = sentiment
            if any(
                w in text_lower
                for w in ["failed", "crash", "slow", "timed out", "error"]
            ) and topic_name in ["Payment Processing", "Performance & Stability"]:
                topic_sentiment = "Negative"
            topics.append({"topic_name": topic_name, "sentiment": topic_sentiment})

    if not topics:
        topics.append({"topic_name": "General Feedback", "sentiment": sentiment})

    summary = f"Customer provided {rating}/5 rating expressing {sentiment.lower()} feedback regarding {', '.join(t['topic_name'] for t in topics)}."

    return {
        "sentiment": sentiment,
        "confidence_score": round(confidence, 2),
        "summary": summary,
        "topics": topics,
    }
