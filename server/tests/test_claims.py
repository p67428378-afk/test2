import pytest
from datetime import datetime, timedelta, timezone
from fastapi import status


@pytest.fixture
def donor_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "donor_claim@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "Donor Restaurant",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "donor_claim@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


@pytest.fixture
def ngo_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "ngo_claim@example.com",
            "password": "testpassword",
            "role": "ngo",
            "name": "NGO Representative",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ngo_claim@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


def test_create_claim(client, donor_token, ngo_token):
    # AC: NGO Claim Allocation and Request Handling
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

    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    response = client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 15.0,
            "target_pickup_time": pickup_time,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["donation_id"] == donation["id"]
    assert data["quantity"] == 15.0
    assert data["status"] == "PENDING"


def test_create_claim_insufficient_quantity(client, donor_token, ngo_token):
    # AC: NGO Claim Allocation and Request Handling
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

    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    response = client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 25.0,
            "target_pickup_time": pickup_time,
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_create_claim_expired_donation(client, donor_token, ngo_token):
    # AC: NGO Claim Allocation and Request Handling
    # Prepared 7 hours ago with 6 hours shelf life -> EXPIRED
    prep_time = (datetime.now(timezone.utc) - timedelta(hours=7)).isoformat()
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

    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    response = client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 10.0,
            "target_pickup_time": pickup_time,
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_claims(client, donor_token, ngo_token):
    # AC: NGO Claim Allocation and Request Handling
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

    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 15.0,
            "target_pickup_time": pickup_time,
        },
    )

    response = client.get(
        "/api/v1/claims", headers={"Authorization": f"Bearer {ngo_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
