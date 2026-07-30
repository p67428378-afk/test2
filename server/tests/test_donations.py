from datetime import datetime, timedelta


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_donation(client):
    # Register restaurant
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rest@example.com",
            "password": "password",
            "full_name": "Rest Owner",
            "role": "restaurant",
            "address": "123 Rest St",
        },
    )
    headers = get_auth_headers(client, "rest@example.com", "password")

    best_before = (datetime.utcnow() + timedelta(days=1)).isoformat()
    response = client.post(
        "/api/v1/donations",
        json={
            "best_before_dt": best_before,
            "description": "10 Large Pizzas",
            "quantity": "10 meals",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "10 Large Pizzas"
    assert data["quantity"] == "10 meals"
    assert data["status"] == "available"
    assert "id" in data


def test_list_donations(client):
    # Register restaurant and create donation
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rest2@example.com",
            "password": "password",
            "full_name": "Rest Owner 2",
            "role": "restaurant",
            "address": "123 Rest St",
        },
    )
    headers = get_auth_headers(client, "rest2@example.com", "password")

    best_before = (datetime.utcnow() + timedelta(days=1)).isoformat()
    client.post(
        "/api/v1/donations",
        json={
            "best_before_dt": best_before,
            "description": "Fresh Salads",
            "quantity": "5 portions",
        },
        headers=headers,
    )

    # List donations
    response = client.get("/api/v1/donations", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(d["description"] == "Fresh Salads" for d in data)


def test_request_donation(client):
    # Register restaurant and create donation
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rest3@example.com",
            "password": "password",
            "full_name": "Rest Owner 3",
            "role": "restaurant",
            "address": "123 Rest St",
        },
    )
    rest_headers = get_auth_headers(client, "rest3@example.com", "password")

    best_before = (datetime.utcnow() + timedelta(days=1)).isoformat()
    create_resp = client.post(
        "/api/v1/donations",
        json={
            "best_before_dt": best_before,
            "description": "Assorted Breads",
            "quantity": "5 kg",
        },
        headers=rest_headers,
    )
    donation_id = create_resp.json()["id"]

    # Register NGO
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "ngo@example.com",
            "password": "password",
            "full_name": "NGO Coordinator",
            "role": "ngo",
            "address": "456 NGO Rd",
        },
    )
    ngo_headers = get_auth_headers(client, "ngo@example.com", "password")

    # Request donation
    response = client.post(
        f"/api/v1/donations/{donation_id}/request", headers=ngo_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["donation_id"] == donation_id
    assert data["status"] == "accepted"

    # Verify donation status is now requested
    get_resp = client.get(f"/api/v1/donations/{donation_id}", headers=ngo_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["status"] == "requested"
