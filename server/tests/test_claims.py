def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"username": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_claim_success(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a found item
    item_response = client.post(
        "/api/v1/items",
        json={
            "name": "Silver Ring",
            "description": "Engraved with initials AM",
            "category": "Jewelry",
            "location_text": "Gym Locker Room",
            "status": "reported_found",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )
    item_id = item_response.json()["id"]

    # Submit claim
    claim_response = client.post(
        "/api/v1/claims",
        json={
            "item_id": item_id,
            "claimant_description": "It is my silver wedding ring with initials AM.",
        },
        headers=headers,
    )
    assert claim_response.status_code == 201
    claim_data = claim_response.json()
    assert claim_data["item_id"] == item_id
    assert claim_data["status"] == "pending_verification"
    assert (
        claim_data["claimant_description"]
        == "It is my silver wedding ring with initials AM."
    )


def test_create_claim_not_found(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.post(
        "/api/v1/claims",
        json={
            "item_id": "00000000-0000-0000-0000-000000000000",
            "claimant_description": "My lost item",
        },
        headers=headers,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_create_claim_invalid_status(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a lost item (cannot be claimed, only found items can be claimed)
    item_response = client.post(
        "/api/v1/items",
        json={
            "name": "Lost Backpack",
            "description": "Blue Jansport",
            "category": "Bags",
            "location_text": "Bus Stop",
            "status": "reported_lost",
            "item_date": "2026-07-29",
        },
        headers=headers,
    )
    item_id = item_response.json()["id"]

    response = client.post(
        "/api/v1/claims",
        json={"item_id": item_id, "claimant_description": "My backpack"},
        headers=headers,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Only found items can be claimed"
