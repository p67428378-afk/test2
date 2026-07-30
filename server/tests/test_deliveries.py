from datetime import datetime, timedelta


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_delivery_workflow(client):
    # Register restaurant
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rest_del@example.com",
            "password": "password",
            "full_name": "Rest Del",
            "role": "restaurant",
            "address": "123 Rest St",
        },
    )
    rest_headers = get_auth_headers(client, "rest_del@example.com", "password")

    # Create donation
    best_before = (datetime.utcnow() + timedelta(days=1)).isoformat()
    create_resp = client.post(
        "/api/v1/donations",
        json={
            "best_before_dt": best_before,
            "description": "Chicken Curry",
            "quantity": "12 meals",
        },
        headers=rest_headers,
    )
    donation_id = create_resp.json()["id"]

    # Register NGO
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "ngo_del@example.com",
            "password": "password",
            "full_name": "NGO Del",
            "role": "ngo",
            "address": "456 NGO Rd",
        },
    )
    ngo_headers = get_auth_headers(client, "ngo_del@example.com", "password")

    # Request donation (creates delivery task)
    client.post(f"/api/v1/donations/{donation_id}/request", headers=ngo_headers)

    # Register Volunteer
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "vol_del@example.com",
            "password": "password",
            "full_name": "Volunteer Del",
            "role": "volunteer",
            "address": "789 Vol St",
        },
    )
    vol_headers = get_auth_headers(client, "vol_del@example.com", "password")

    # List deliveries
    list_resp = client.get("/api/v1/deliveries", headers=vol_headers)
    assert list_resp.status_code == 200
    deliveries = list_resp.json()
    assert len(deliveries) >= 1

    # Find the delivery task we just created
    delivery = next(d for d in deliveries if d["description"] == "Chicken Curry")
    delivery_id = delivery["id"]
    assert delivery["status"] == "assigned"
    assert delivery["volunteer_id"] is None
    assert delivery["pickup_address"] == "123 Rest St"
    assert delivery["delivery_address"] == "456 NGO Rd"

    # Accept delivery task
    accept_resp = client.post(
        f"/api/v1/deliveries/{delivery_id}/accept", headers=vol_headers
    )
    assert accept_resp.status_code == 200
    assert accept_resp.json()["volunteer_id"] is not None

    # Update status to picked_up
    status_resp = client.put(
        f"/api/v1/deliveries/{delivery_id}/status",
        json={"status": "picked_up"},
        headers=vol_headers,
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "picked_up"
    assert status_resp.json()["pickup_at"] is not None

    # Verify donation status is in_transit
    get_resp = client.get(f"/api/v1/donations/{donation_id}", headers=vol_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["status"] == "in_transit"

    # Update status to delivered
    status_resp = client.put(
        f"/api/v1/deliveries/{delivery_id}/status",
        json={"status": "delivered"},
        headers=vol_headers,
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "delivered"
    assert status_resp.json()["delivered_at"] is not None

    # Verify donation status is delivered
    get_resp = client.get(f"/api/v1/donations/{donation_id}", headers=vol_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["status"] == "delivered"
