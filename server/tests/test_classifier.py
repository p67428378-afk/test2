from unittest.mock import patch

import pytest

from server.app.services.ai_classifier import (
    VALID_CATEGORIES,
    classify_email,
    classify_email_async,
)


def test_classify_urgent_email():
    # AC: AI Classification Engine: Categorize into Urgent
    subject = "CRITICAL: Production Outage Emergency"
    body = "Immediate action required: The database cluster has crashed. P0 outage affecting all customers."
    category, confidence, scores = classify_email(subject=subject, body_text=body)
    assert category == "Urgent"
    assert confidence >= 80.0
    assert "Urgent" in scores


def test_classify_work_email():
    # AC: AI Classification Engine: Categorize into Work
    subject = "Sprint Planning and Architecture Review"
    body = "Hi team, let's discuss the upcoming engineering sprint roadmap, deliverables, and Jira tasks."
    category, confidence, scores = classify_email(subject=subject, body_text=body)
    assert category == "Work"
    assert confidence >= 80.0
    assert "Work" in scores


def test_classify_promotional_email():
    # AC: AI Classification Engine: Categorize into Promotional
    subject = "Exclusive 50% Off Flash Sale!"
    body = "Don't miss our weekend discount offer. Use promo voucher coupon code SAVE50 to shop now."
    category, confidence, scores = classify_email(subject=subject, body_text=body)
    assert category == "Promotional"
    assert confidence >= 80.0
    assert "Promotional" in scores


def test_classify_personal_email():
    # AC: AI Classification Engine: Categorize into Personal
    subject = "Dinner plans this weekend"
    body = "Hey friend, are you free for dinner and drinks Saturday? Let's catch up on vacation stories."
    category, confidence, scores = classify_email(subject=subject, body_text=body)
    assert category == "Personal"
    assert confidence >= 80.0
    assert "Personal" in scores


def test_classify_fallback_default():
    # AC: AI Classification Engine fallback when no strong keywords match
    subject = "Hello"
    body = "Testing 1 2 3"
    category, confidence, scores = classify_email(subject=subject, body_text=body)
    assert category in VALID_CATEGORIES
    assert 50.0 <= confidence <= 100.0


@pytest.mark.asyncio
async def test_classify_email_async_timeout():
    # AC: Edge Cases & Error Handling: AI service timeouts
    with patch("server.app.services.ai_classifier.classify_email") as mock_classify:

        def slow_classify(*args, **kwargs):
            import time

            time.sleep(0.1)
            return ("Work", 85.0, {})

        mock_classify.side_effect = slow_classify
        with pytest.raises(TimeoutError, match="timed out"):
            await classify_email_async("Subject", "Body", timeout=0.01)
