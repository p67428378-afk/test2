from datetime import datetime, timezone


def get_auth_headers(client, email, password):
    # Helper to register and login a user, returning auth headers
    client.post("/api/v1/auth/register", json={"email": email, "password": password})
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_item_success(client):
    # AC: Item Reporting (Lost & Found) - Users must be able to report either a lost or found item
    headers = get_auth_headers(client, "user1@example.com", "password123")
    payload = {
        "type": "lost",
        "category": "Electronics",
        "description": "Black Leather Wallet",
        "location": "Building A, Floor 2",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": ["https://example.com/wallet.jpg"],
    }
    response = client.post("/api/v1/items", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "lost"
    assert data["category"] == "Electronics"
    assert data["description"] == "Black Leather Wallet"
    assert data["status"] == "REPORTED_LOST"
    assert len(data["images"]) == 1
    assert data["images"][0]["image_url"] == "https://example.com/wallet.jpg"


def test_create_item_invalid_image_warning(client):
    # AC: Item Reporting (Lost & Found) - Edge Case: If image upload fails or invalid file type, accept text report
    headers = get_auth_headers(client, "user2@example.com", "password123")
    payload = {
        "type": "found",
        "category": "Keys",
        "description": "Brass keys on a ring",
        "location": "Cafeteria",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": ["https://example.com/keys.txt"],  # Invalid extension
    }
    response = client.post("/api/v1/items", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "found"
    assert data["status"] == "AVAILABLE_FOUND"
    assert len(data["images"]) == 0  # Invalid image was skipped


def test_ai_matching_suggestions(client):
    # AC: AI-Powered Match Suggestions - AI matching engine compares item metadata and calculates similarity
    headers1 = get_auth_headers(client, "user3@example.com", "password123")
    headers2 = get_auth_headers(client, "user4@example.com", "password123")

    # 1. Report lost wallet
    lost_payload = {
        "type": "lost",
        "category": "Electronics",
        "description": "Black Leather Wallet with cards",
        "location": "Building A",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": [],
    }
    lost_resp = client.post("/api/v1/items", json=lost_payload, headers=headers1)
    lost_id = lost_resp.json()["id"]

    # 2. Report found wallet (similar description and same category/location)
    found_payload = {
        "type": "found",
        "category": "Electronics",
        "description": "Found Black Leather Wallet",
        "location": "Building A",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": [],
    }
    found_resp = client.post("/api/v1/items", json=found_payload, headers=headers2)
    found_id = found_resp.json()["id"]

    # 3. Get matches for lost item
    matches_resp = client.get(f"/api/v1/items/{lost_id}/matches", headers=headers1)
    assert matches_resp.status_code == 200
    matches = matches_resp.json()
    assert len(matches) >= 1
    assert matches[0]["confidence_score"] >= 50.0
    assert matches[0]["found_item_id"] == found_id
