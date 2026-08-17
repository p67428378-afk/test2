def test_submit_claim_success(client, user_token):
    # AC: Admin Ownership Verification Workflow - Submit Claim Happy Path
    # 1. Report a found item
    found_payload = {
        "type": "found",
        "category": "Electronics",
        "name": "Black iPhone 15 Pro",
        "description": "Found a black iPhone 15 with a cracked screen protector near the cafeteria",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "admin@example.com",
    }
    found_resp = client.post(
        "/api/v1/items",
        json=found_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert found_resp.status_code == 201
    found_item_id = found_resp.json()["id"]

    # 2. Submit claim
    claim_payload = {
        "item_id": found_item_id,
        "proof_of_ownership": "It has a sticker of a cat on the back and the lock screen is Jane Doe.",
    }
    claim_resp = client.post(
        "/api/v1/claims",
        json=claim_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert claim_resp.status_code == 201
    data = claim_resp.json()
    assert data["status"] == "pending"
    assert data["proof_of_ownership"] == claim_payload["proof_of_ownership"]


def test_submit_claim_duplicate_pending(client, user_token):
    # AC: Admin Ownership Verification Workflow - Edge Case: Duplicate pending claim
    # 1. Report a found item
    found_payload = {
        "type": "found",
        "category": "Electronics",
        "name": "Black iPhone 15 Pro",
        "description": "Found a black iPhone 15 with a cracked screen protector near the cafeteria",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "admin@example.com",
    }
    found_resp = client.post(
        "/api/v1/items",
        json=found_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert found_resp.status_code == 201
    found_item_id = found_resp.json()["id"]

    # 2. Submit claim 1
    claim_payload = {
        "item_id": found_item_id,
        "proof_of_ownership": "It has a sticker of a cat on the back.",
    }
    claim_resp1 = client.post(
        "/api/v1/claims",
        json=claim_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert claim_resp1.status_code == 201

    # 3. Submit claim 2 (duplicate)
    claim_resp2 = client.post(
        "/api/v1/claims",
        json=claim_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert claim_resp2.status_code == 400
    assert (
        "You already have a pending claim for this item" in claim_resp2.json()["detail"]
    )
