import pytest
from datetime import datetime, timedelta, timezone
from fastapi import status


@pytest.fixture
def donor_token(client):
    # Register donor
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "donor_test@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "Donor Restaurant",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "donor_test@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


@pytest.fixture
def ngo_token(client):
    # Register NGO
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "ngo_test@example.com",
            "password": "testpassword",
            "role": "ngo",
            "name": "NGO Representative",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ngo_test@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


def test_create_donation(client, donor_token):
    # AC: Surplus Food Posting & Real-Time Freshness Monitoring
    prep_time = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    response = client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["category"] == "Cooked Rice"
    assert data["quantity"] == 20.0
    assert data["freshness_status"] == "FRESH"


def test_create_donation_unauthorized(client, ngo_token):
    # AC: Role-Based Access Control and Multi-Portal Authentication
    prep_time = datetime.now(timezone.utc).isoformat()
    response = client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_donations(client, donor_token):
    # AC: Surplus Food Posting & Real-Time Freshness Monitoring
    prep_time = datetime.now(timezone.utc).isoformat()
    client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    )
    response = client.get("/api/v1/donations")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1


def test_freshness_warning_and_expired(client, donor_token):
    # AC: Surplus Food Posting & Real-Time Freshness Monitoring
    # Create a donation prepared 5 hours ago with 6 hours shelf life -> should be WARNING (>= 2/3 of 6 = 4 hours)
    prep_time_warning = (datetime.now(timezone.utc) - timedelta(hours=5)).isoformat()
    response_warning = client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time_warning,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    )
    assert response_warning.status_code == status.HTTP_201_CREATED
    assert response_warning.json()["freshness_status"] == "WARNING"

    # Create a donation prepared 7 hours ago with 6 hours shelf life -> should be EXPIRED
    prep_time_expired = (datetime.now(timezone.utc) - timedelta(hours=7)).isoformat()
    response_expired = client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time_expired,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    )
    assert response_expired.status_code == status.HTTP_201_CREATED
    assert response_expired.json()["freshness_status"] == "EXPIRED"


def test_patch_freshness_status(client, donor_token):
    # AC: Surplus Food Posting & Real-Time Freshness Monitoring
    prep_time = datetime.now(timezone.utc).isoformat()
    donation = client.post(
        "/api/v1/donations",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={
            "category": "Cooked Rice",
            "quantity": 20.0,
            "preparation_time": prep_time,
            "storage_condition": "Refrigerated",
            "pickup_address": "123 Restaurant St",
            "estimated_shelf_life": 6,
        },
    ).json()

    response = client.patch(
        f"/api/v1/donations/{donation['id']}/freshness",
        headers={"Authorization": f"Bearer {donor_token}"},
        json={"freshness_status": "EXPIRED"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["freshness_status"] == "EXPIRED"
