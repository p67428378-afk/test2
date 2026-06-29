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


def test_create_visit(client, auth_headers, membership_id):
    # AC: The platform must provide a feature to track gym visits, either through manual input or integration with gym systems (if available).
    response = client.post(
        "/api/v1/visits",
        json={"membership_id": membership_id, "visit_date": "2026-06-29"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["membership_id"] == membership_id
    assert data["visit_date"] == "2026-06-29"
    assert "id" in data


def test_create_visit_invalid_membership(client, auth_headers):
    # AC: The platform must provide a feature to track gym visits, either through manual input or integration with gym systems (if available).
    response = client.post(
        "/api/v1/visits",
        json={"membership_id": "non-existent-id", "visit_date": "2026-06-29"},
        headers=auth_headers,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Membership not found"


def test_list_visits(client, auth_headers, membership_id):
    # AC: The platform must provide a feature to track gym visits, either through manual input or integration with gym systems (if available).
    client.post(
        "/api/v1/visits",
        json={"membership_id": membership_id, "visit_date": "2026-06-29"},
        headers=auth_headers,
    )
    client.post(
        "/api/v1/visits",
        json={"membership_id": membership_id, "visit_date": "2026-06-28"},
        headers=auth_headers,
    )
    response = client.get("/api/v1/visits", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["visit_date"] == "2026-06-29"
    assert data[1]["visit_date"] == "2026-06-28"
