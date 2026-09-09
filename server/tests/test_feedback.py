"""Tests for Recommendation Feedback API endpoints."""


def test_submit_and_update_feedback(client):
    """Verify submitting like feedback, and updating to dislike on same recommendation."""
    user_id = "test_feedback_user"
    # 1. Generate a recommendation to obtain a recommendation_id
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={"user_id": user_id, "limit": 1},
    )
    assert gen_res.status_code == 200
    rec_id = gen_res.json()["recommendations"][0]["recommendation_id"]

    # 2. Submit initial "like" feedback
    fb_res = client.post(
        "/api/v1/recommendations/feedback",
        json={
            "recommendation_id": rec_id,
            "user_id": user_id,
            "feedback": "like",
        },
    )
    assert fb_res.status_code == 200
    fb_data = fb_res.json()
    assert fb_data["recommendation_id"] == rec_id
    assert fb_data["feedback"] == "like"
    assert fb_data["status"] == "updated"

    # 3. Update feedback to "dislike"
    update_fb_res = client.post(
        "/api/v1/recommendations/feedback",
        json={
            "recommendation_id": rec_id,
            "user_id": user_id,
            "feedback": "dislike",
        },
    )
    assert update_fb_res.status_code == 200
    assert update_fb_res.json()["feedback"] == "dislike"


def test_submit_invalid_feedback(client):
    """Verify submitting invalid feedback value returns 400 Bad Request."""
    user_id = "test_invalid_fb_user"
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={"user_id": user_id, "limit": 1},
    )
    rec_id = gen_res.json()["recommendations"][0]["recommendation_id"]

    response = client.post(
        "/api/v1/recommendations/feedback",
        json={
            "recommendation_id": rec_id,
            "user_id": user_id,
            "feedback": "neutral_maybe",
        },
    )
    assert response.status_code == 400 or response.status_code == 422


def test_feedback_non_existent_recommendation(client):
    """Verify 404 when submitting feedback for unknown recommendation ID."""
    response = client.post(
        "/api/v1/recommendations/feedback",
        json={
            "recommendation_id": "non-existent-rec-id-9999",
            "user_id": "test_user",
            "feedback": "like",
        },
    )
    assert response.status_code == 404
