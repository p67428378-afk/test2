def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"username": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_item_success(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.post(
        "/api/v1/items",
        json={
            "name": "Black Leather Wallet",
            "description": "Contains ID and credit cards",
            "category": "Wallet",
            "location_text": "Main Cafeteria",
            "lat": 40.7128,
            "lon": -74.0060,
            "status": "reported_lost",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Black Leather Wallet"
    assert data["status"] == "reported_lost"
    assert data["category"] == "Wallet"


def test_create_item_unauthorized(client):
    response = client.post(
        "/api/v1/items",
        json={
            "name": "Black Leather Wallet",
            "description": "Contains ID and credit cards",
            "category": "Wallet",
            "location_text": "Main Cafeteria",
            "status": "reported_lost",
            "item_date": "2026-07-29",
        },
    )
    assert response.status_code == 401


def test_get_found_items(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    # Create a found item
    client.post(
        "/api/v1/items",
        json={
            "name": "Keys with red keychain",
            "description": "Found near library",
            "category": "Keys",
            "location_text": "Library",
            "status": "reported_found",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )

    response = client.get("/api/v1/items/found", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any(item["name"] == "Keys with red keychain" for item in data["items"])


def test_ai_matching(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a found item
    client.post(
        "/api/v1/items",
        json={
            "name": "iPhone 14 Pro Max",
            "description": "Space gray, cracked screen protector",
            "category": "Electronics",
            "location_text": "Science Lab",
            "status": "reported_found",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )

    # Create a lost item
    lost_response = client.post(
        "/api/v1/items",
        json={
            "name": "iPhone 14",
            "description": "Space gray color",
            "category": "Electronics",
            "location_text": "Science Building",
            "status": "reported_lost",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )
    lost_item_id = lost_response.json()["id"]

    # Get matches
    matches_response = client.get(
        f"/api/v1/items/lost/{lost_item_id}/matches", headers=headers
    )
    assert matches_response.status_code == 200
    matches_data = matches_response.json()
    assert "matches" in matches_data
    assert len(matches_data["matches"]) >= 1
    assert matches_data["matches"][0]["score"] > 0.5
    assert matches_data["matches"][0]["item"]["name"] == "iPhone 14 Pro Max"
