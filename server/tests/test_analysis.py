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


@pytest.fixture
def membership_id(client, auth_headers):
    response = client.post(
        "/api/v1/memberships",
        json={
            "gym_name": "Gold's Gym",
            "membership_type": "Platinum",
            "monthly_fee": 80.0,
        },
        headers=auth_headers,
    )
    return response.json()["id"]


def test_get_analysis_underutilized(client, auth_headers, membership_id):
    # AC: The system should calculate the 'cost per visit' based on the monthly membership fee and the number of visits.
    # AC: The platform should suggest more cost-effective alternatives if the user's membership is underutilized.
    # AC: A dashboard should visualize attendance frequency (e.g., weekly, monthly).
    # Log 3 visits (underutilized, target is 8)
    # Days 05 (W1), 12 (W2), 20 (W3)
    for day in ["05", "12", "20"]:
        client.post(
            "/api/v1/visits",
            json={"membership_id": membership_id, "visit_date": f"2026-06-{day}"},
            headers=auth_headers,
        )

    # Configure notification settings to trigger cost per visit alert
    client.post(
        "/api/v1/notifications/configure",
        json={
            "inactive_days_threshold": 14,
            "cost_per_visit_threshold": 20.0,
            "email_notifications_enabled": True,
        },
        headers=auth_headers,
    )

    response = client.get("/api/v1/analysis", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # Verify overall summary
    summary = data["overall_summary"]
    assert summary["total_monthly_fees"] == 80.0
    assert summary["total_visits_this_month"] == 3
    assert summary["average_cost_per_visit"] == 80.0 / 3
    assert summary["total_estimated_waste"] == 80.0 - (3 * 10.0)  # 50.0
    assert len(summary["alerts"]) > 0
    assert "exceeds your threshold" in summary["alerts"][0]

    # Verify membership analysis
    m_analysis = data["memberships_analysis"][0]
    assert m_analysis["membership_id"] == membership_id
    assert m_analysis["gym_name"] == "Gold's Gym"
    assert m_analysis["monthly_fee"] == 80.0
    assert m_analysis["total_visits"] == 3
    assert m_analysis["cost_per_visit"] == 80.0 / 3
    assert m_analysis["utilization_percentage"] == (3 / 8.0) * 100.0
    assert m_analysis["status"] == "Underutilized"
    assert m_analysis["estimated_monthly_waste"] == 50.0
    assert m_analysis["attendance_frequency"] == [1, 1, 1, 0]

    # Verify alternatives
    alternatives = m_analysis["alternatives"]
    assert len(alternatives) == 3
    assert alternatives[0]["name"] == "Pay-As-You-Go Pass"
    assert alternatives[0]["estimated_monthly_cost"] == 3 * 15.0
    assert alternatives[0]["estimated_savings"] == 80.0 - (3 * 15.0)
