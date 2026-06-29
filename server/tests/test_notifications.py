import pytest


@pytest.fixture
def auth_headers(client):
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    response = client.post(
        "/api/v1/users/login",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_configure_notifications(client, auth_headers):
    # AC: Users should receive optional notifications if they haven't visited the gym for a specified period (e.g., 2 weeks).
    # AC: Alerts can be configured to notify the user when their 'cost per visit' exceeds a certain threshold.
    response = client.post(
        "/api/v1/notifications/configure",
        json={
            "inactive_days_threshold": 14,
            "cost_per_visit_threshold": 20.0,
            "email_notifications_enabled": True,
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["inactive_days_threshold"] == 14
    assert data["cost_per_visit_threshold"] == 20.0
    assert data["email_notifications_enabled"] is True
    assert "id" in data
    assert "user_id" in data
