def test_submit_positive_feedback(client):
    payload = {
        "feedback_text": "The new interface is super fast, clean, and intuitive! Love it.",
        "rating": 5,
        "customer_email": "happy_user@example.com",
    }
    response = client.post("/api/v1/feedback", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["analysis_status"] == "Analyzed"
    assert data["rating"] == 5
    assert data["customer_email"] == "happy_user@example.com"
    assert data["sentiment_analysis"]["sentiment"] == "Positive"
    assert data["sentiment_analysis"]["score"] >= 0.70
    assert len(data["topics"]) > 0


def test_submit_negative_feedback(client):
    payload = {
        "feedback_text": "Checkout timed out and failed completely when paying with card. Slow and buggy.",
        "rating": 1,
        "customer_email": "frustrated@example.com",
    }
    response = client.post("/api/v1/feedback", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["sentiment_analysis"]["sentiment"] == "Negative"
    topic_names = [t["topic_name"] for t in data["topics"]]
    assert any("Payment" in name or "Speed" in name for name in topic_names)


def test_submit_feedback_invalid_rating(client):
    payload = {
        "feedback_text": "Nice app",
        "rating": 6,
    }
    response = client.post("/api/v1/feedback", json=payload)
    assert response.status_code in (400, 422)


def test_submit_feedback_empty_text(client):
    payload = {
        "feedback_text": "   ",
        "rating": 4,
    }
    response = client.post("/api/v1/feedback", json=payload)
    assert response.status_code in (400, 422)


def test_get_feedback_by_id_success(client):
    # First submit
    payload = {
        "feedback_text": "Customer service resolved my issue within 10 minutes.",
        "rating": 4,
        "customer_email": "service_fan@example.com",
    }
    create_res = client.post("/api/v1/feedback", json=payload)
    feedback_id = create_res.json()["id"]

    # Retrieve
    get_res = client.get(f"/api/v1/feedback/{feedback_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == feedback_id
    assert data["rating"] == 4
    assert data["sentiment_analysis"]["sentiment"] == "Positive"
    assert len(data["topics"]) > 0


def test_get_feedback_nonexistent_id(client):
    response = client.get("/api/v1/feedback/non-existent-uuid-123")
    assert response.status_code == 404


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
