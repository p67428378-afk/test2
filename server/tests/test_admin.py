def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"username": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_admin_endpoints_unauthorized(client):
    # Non-admin user tries to access admin endpoints
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    response = client.get("/api/v1/admin/claims", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized as admin"


def test_admin_get_claims(client):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    user_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a found item and a claim
    item_response = client.post(
        "/api/v1/items",
        json={
            "name": "Gold Watch",
            "description": "Rolex watch",
            "category": "Jewelry",
            "location_text": "Hotel Lobby",
            "status": "reported_found",
            "item_date": "2026-07-29",
        },
        headers=user_headers,
    )
    item_id = item_response.json()["id"]

    client.post(
        "/api/v1/claims",
        json={"item_id": item_id, "claimant_description": "My Rolex watch"},
        headers=user_headers,
    )

    # Admin gets claims
    response = client.get("/api/v1/admin/claims", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert data["claims"][0]["item"]["name"] == "Gold Watch"
    assert data["claims"][0]["user"]["email"] == "test@example.com"


def test_admin_approve_claim(client):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    user_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a found item and a claim
    item_response = client.post(
        "/api/v1/items",
        json={
            "name": "Black Umbrella",
            "description": "Large umbrella",
            "category": "Accessories",
            "location_text": "Office Reception",
            "status": "reported_found",
            "item_date": "2026-07-29",
        },
        headers=user_headers,
    )
    item_id = item_response.json()["id"]

    claim_response = client.post(
        "/api/v1/claims",
        json={"item_id": item_id, "claimant_description": "My umbrella"},
        headers=user_headers,
    )
    claim_id = claim_response.json()["id"]

    # Admin approves claim
    response = client.put(
        f"/api/v1/admin/claims/{claim_id}",
        json={"status": "approved"},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "approved"

    # Verify item status is now 'claimed'
    items_response = client.get("/api/v1/admin/items", headers=admin_headers)
    assert items_response.status_code == 200
    items_data = items_response.json()
    assert any(
        item["id"] == item_id and item["status"] == "claimed"
        for item in items_data["items"]
    )


def test_admin_get_users(client):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    response = client.get("/api/v1/admin/users", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    assert any(user["email"] == "admin@example.com" for user in data["users"])
    assert any(user["email"] == "test@example.com" for user in data["users"])
