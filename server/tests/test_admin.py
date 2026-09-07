import pytest


@pytest.fixture
def admin_token(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    return res.json()["access_token"]


@pytest.fixture
def user_token(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    return res.json()["access_token"]


def test_admin_insights_unauthenticated_returns_401(client):
    res = client.get("/api/v1/admin/insights")
    assert res.status_code == 401


def test_admin_insights_regular_user_forbidden_returns_403(client, user_token):
    res = client.get(
        "/api/v1/admin/insights", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 403
    assert "insufficient permissions" in res.json()["detail"].lower()


def test_admin_insights_empty_state(client, admin_token):
    res = client.get(
        "/api/v1/admin/insights", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "total_feedback" in data
    assert "avg_rating" in data
    assert "sentiment_distribution" in data
    assert "top_topics" in data
    assert "historical_trends" in data


def test_admin_insights_with_data(client, admin_token):
    # Submit several feedbacks
    client.post(
        "/api/v1/feedback",
        json={
            "rating": 5,
            "feedback_text": "Great interface and very fast experience!",
            "customer_email": "user1@example.com",
            "category": "UI Usability",
        },
    )
    client.post(
        "/api/v1/feedback",
        json={
            "rating": 1,
            "feedback_text": "Payment failed completely, checkout timed out.",
            "customer_email": "user2@example.com",
            "category": "Payment Processing",
        },
    )

    res = client.get(
        "/api/v1/admin/insights?timeframe=30d",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_feedback"] >= 2
    assert data["avg_rating"] > 0
    assert data["sentiment_distribution"]["positive"] >= 1
    assert data["sentiment_distribution"]["negative"] >= 1
    assert len(data["top_topics"]) > 0
    assert len(data["historical_trends"]) > 0


def test_admin_feedback_list_and_filters(client, admin_token):
    client.post(
        "/api/v1/feedback",
        json={
            "rating": 2,
            "feedback_text": "Slow response from customer support agent.",
            "customer_email": "filter_test@example.com",
            "category": "Customer Support",
        },
    )

    # List all
    res = client.get(
        "/api/v1/admin/feedback?skip=0&limit=10",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1

    # Filter by search
    res_search = client.get(
        "/api/v1/admin/feedback?search=filter_test",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_search.status_code == 200
    assert any(
        i["customer_email"] == "filter_test@example.com"
        for i in res_search.json()["items"]
    )

    # Filter by rating
    res_rating = client.get(
        "/api/v1/admin/feedback?rating=2",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_rating.status_code == 200
    assert all(i["rating"] == 2 for i in res_rating.json()["items"])


def test_admin_alerts_list(client, admin_token):
    # Submit critical feedback to ensure alert is logged
    client.post(
        "/api/v1/feedback",
        json={
            "rating": 1,
            "feedback_text": "Critical failure in application flow.",
            "customer_email": "alert_tester@example.com",
        },
    )

    res = client.get(
        "/api/v1/admin/alerts", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) >= 1
    assert alerts[0]["alert_type"] == "EMAIL"


def test_admin_export_csv(client, admin_token):
    client.post(
        "/api/v1/feedback",
        json={
            "rating": 5,
            "feedback_text": "Awesome export functionality!",
            "customer_email": "export_tester@example.com",
        },
    )

    res = client.get(
        "/api/v1/admin/export?timeframe=30d",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert (
        "attachment; filename=feedback_insights_export.csv"
        in res.headers["content-disposition"]
    )
    content = res.text
    assert "id,created_at,rating,sentiment,topic" in content
    assert "export_tester@example.com" in content
