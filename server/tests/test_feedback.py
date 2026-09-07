def test_submit_valid_positive_feedback(client):
    payload = {
        "rating": 5,
        "feedback_text": "The checkout process was fast, easy, and awesome! Loved the UI.",
        "customer_email": "customer1@example.com",
        "category": "UI Usability",
    }
    res = client.post("/api/v1/feedback", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["rating"] == 5
    assert data["customer_email"] == "customer1@example.com"
    assert data["status"] == "Processed"
    assert "id" in data
    assert data["sentiment"]["sentiment"] == "Positive"
    assert data["sentiment"]["confidence_score"] >= 0.7
    assert len(data["topics"]) > 0


def test_submit_critical_negative_feedback_triggers_alert(client):
    payload = {
        "rating": 1,
        "feedback_text": "System crashed during checkout payment. Terrible experience!",
        "customer_email": "angry_user@example.com",
        "category": "Payment Processing",
    }
    res = client.post("/api/v1/feedback", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["rating"] == 1
    assert data["sentiment"]["sentiment"] == "Negative"
    # Verify alert triggered
    assert len(data["alerts"]) >= 1
    assert data["alerts"][0]["alert_type"] == "EMAIL"
    assert data["alerts"][0]["status"] == "SENT"


def test_submit_feedback_missing_rating_fails_400(client):
    payload = {
        "feedback_text": "Missing rating submission",
        "customer_email": "user@example.com",
    }
    res = client.post("/api/v1/feedback", json=payload)
    assert res.status_code == 400
    assert "rating" in res.json()["detail"].lower()


def test_submit_feedback_invalid_rating_range_fails_400(client):
    payload = {"rating": 6, "feedback_text": "Invalid 6 star rating"}
    res = client.post("/api/v1/feedback", json=payload)
    assert res.status_code == 400


def test_submit_feedback_empty_text_fails_400(client):
    payload = {"rating": 4, "feedback_text": "   "}
    res = client.post("/api/v1/feedback", json=payload)
    assert res.status_code == 400
    assert "feedback text" in res.json()["detail"].lower()


def test_get_feedback_by_id(client):
    # Create feedback first
    create_res = client.post(
        "/api/v1/feedback",
        json={
            "rating": 4,
            "feedback_text": "Good support response time.",
            "customer_email": "carol@startup.io",
        },
    )
    feedback_id = create_res.json()["id"]

    res = client.get(f"/api/v1/feedback/{feedback_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == feedback_id
    assert data["rating"] == 4
    assert data["sentiment"]["sentiment"] == "Positive"


def test_get_feedback_non_existent_404(client):
    res = client.get("/api/v1/feedback/00000000-0000-0000-0000-000000000000")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()
