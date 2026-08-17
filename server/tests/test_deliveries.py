import pytest
from datetime import datetime, timedelta, timezone
from fastapi import status


@pytest.fixture
def donor_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "donor_del@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "Donor Restaurant",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "donor_del@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


@pytest.fixture
def ngo_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "ngo_del@example.com",
            "password": "testpassword",
            "role": "ngo",
            "name": "NGO Representative",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ngo_del@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


@pytest.fixture
def volunteer_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "vol_del@example.com",
            "password": "testpassword",
            "role": "volunteer",
            "name": "Volunteer",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "vol_del@example.com", "password": "testpassword"},
    )
    return response.json()["access_token"]


def test_delivery_lifecycle(client, donor_token, ngo_token, volunteer_token):
    # AC: Volunteer Dispatch, Delivery Routing, and Digital Proof of Delivery
    # 1. Create donation
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

    # 2. Create claim (which automatically creates a delivery task)
    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    claim = client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 15.0,
            "target_pickup_time": pickup_time,
        },
    ).json()

    # 3. Get deliveries (should see the pending delivery)
    deliveries = client.get(
        "/api/v1/deliveries", headers={"Authorization": f"Bearer {volunteer_token}"}
    ).json()
    assert len(deliveries) >= 1
    delivery = deliveries[0]
    assert delivery["status"] == "PENDING"

    # 4. Accept delivery task
    response = client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={"status": "TASK_ACCEPTED"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "TASK_ACCEPTED"

    # 5. Update status to ARRIVED_AT_PICKUP
    response = client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={"status": "ARRIVED_AT_PICKUP"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "ARRIVED_AT_PICKUP"

    # 6. Update status to IN_TRANSIT
    response = client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={"status": "IN_TRANSIT"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "IN_TRANSIT"

    # 7. Complete delivery with photo and signature
    response = client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={
            "status": "DELIVERED",
            "photo_url": "http://example.com/photo.jpg",
            "signature": "John Doe",
        },
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "DELIVERED"


def test_cancel_delivery_mid_transit(client, donor_token, ngo_token, volunteer_token):
    # AC: Volunteer Dispatch, Delivery Routing, and Digital Proof of Delivery
    # 1. Create donation
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

    # 2. Create claim
    pickup_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    claim = client.post(
        "/api/v1/claims",
        headers={"Authorization": f"Bearer {ngo_token}"},
        json={
            "donation_id": donation["id"],
            "quantity": 15.0,
            "target_pickup_time": pickup_time,
        },
    ).json()

    # 3. Get delivery
    delivery = client.get(
        "/api/v1/deliveries", headers={"Authorization": f"Bearer {volunteer_token}"}
    ).json()[0]

    # 4. Accept delivery task
    client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={"status": "TASK_ACCEPTED"},
    )

    # 5. Cancel delivery task mid-transit (status -> CANCELLED)
    response = client.patch(
        f"/api/v1/deliveries/{delivery['id']}/status",
        headers={"Authorization": f"Bearer {volunteer_token}"},
        json={"status": "CANCELLED"},
    )
    assert response.status_code == status.HTTP_200_OK
    # Should be returned to unassigned pool (status PENDING, volunteer_id None)
    assert response.json()["status"] == "PENDING"
    assert response.json()["volunteer_id"] is None
