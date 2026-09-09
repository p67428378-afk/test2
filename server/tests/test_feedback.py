def test_submit_feedback_like_and_dislike(client):
    user_id = "user_fb_test_001"
    # First generate a recommendation to get a valid recommendation_id
    gen_res = client.post(
        "/api/v1/recommendations/generate", json={"user_id": user_id, "limit": 2}
    )
    assert gen_res.status_code == 200
    recs = gen_res.json()["recommendations"]
    assert len(recs) > 0
    rec_id = recs[0]["recommendation_id"]

    # Submit 'like' feedback via /api/v1/recommendations/feedback
    fb_payload = {
        "recommendation_id": rec_id,
        "user_id": user_id,
        "feedback": "like",
    }
    res = client.post("/api/v1/recommendations/feedback", json=fb_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["recommendation_id"] == rec_id
    assert data["feedback"] == "like"
    assert data["status"] in ["created", "updated"]

    # Submit 'dislike' update on same recommendation
    fb_payload["feedback"] = "dislike"
    update_res = client.post("/api/v1/recommendations/feedback", json=fb_payload)
    assert update_res.status_code == 200
    update_data = update_res.json()
    assert update_data["feedback"] == "dislike"
    assert update_data["status"] == "updated"


def test_submit_feedback_via_feedback_route(client):
    user_id = "user_fb_test_002"
    gen_res = client.post(
        "/api/v1/recommendations/generate", json={"user_id": user_id, "limit": 2}
    )
    rec_id = gen_res.json()["recommendations"][0]["recommendation_id"]

    fb_payload = {
        "recommendation_id": rec_id,
        "user_id": user_id,
        "feedback": "like",
    }
    res = client.post("/api/v1/feedback", json=fb_payload)
    assert res.status_code == 200
    assert res.json()["feedback"] == "like"


def test_submit_feedback_not_found(client):
    fb_payload = {
        "recommendation_id": "non-existent-rec-uuid",
        "user_id": "user_123",
        "feedback": "like",
    }
    res = client.post("/api/v1/recommendations/feedback", json=fb_payload)
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


def test_submit_feedback_invalid_value(client):
    user_id = "user_fb_test_003"
    gen_res = client.post(
        "/api/v1/recommendations/generate", json={"user_id": user_id, "limit": 1}
    )
    rec_id = gen_res.json()["recommendations"][0]["recommendation_id"]

    fb_payload = {
        "recommendation_id": rec_id,
        "user_id": user_id,
        "feedback": "invalid_option",
    }
    res = client.post("/api/v1/recommendations/feedback", json=fb_payload)
    assert res.status_code in [400, 422]
