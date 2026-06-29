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


def test_create_membership(client, auth_headers):
    # AC: Users should be able to link their gym membership details to their profile.
    response = client.post(
        "/api/v1/memberships",
        json={
            "gym_name": "Gold's Gym",
            "membership_type": "Platinum",
            "monthly_fee": 80.0,
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["gym_name"] == "Gold's Gym"
    assert data["membership_type"] == "Platinum"
    assert data["monthly_fee"] == 80.0
    assert "id" in data


def test_list_memberships(client, auth_headers):
    # AC: The system should support a variety of popular gym chains and membership types.
    client.post(
        "/api/v1/memberships",
        json={
            "gym_name": "Gold's Gym",
            "membership_type": "Platinum",
            "monthly_fee": 80.0,
        },
        headers=auth_headers,
    )
    client.post(
        "/api/v1/memberships",
        json={
            "gym_name": "Planet Fitness",
            "membership_type": "Classic",
            "monthly_fee": 15.0,
        },
        headers=auth_headers,
    )
    response = client.get("/api/v1/memberships", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["gym_name"] == "Gold's Gym"
    assert data[1]["gym_name"] == "Planet Fitness"
