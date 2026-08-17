def test_admin_verify_claim_approve(client, user_token, admin_token):
    # AC: Admin Ownership Verification Workflow - Approve Claim
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
        "proof_of_ownership": "It has a sticker of a cat on the back.",
    }
    claim_resp = client.post(
        "/api/v1/claims",
        json=claim_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert claim_resp.status_code == 201
    claim_id = claim_resp.json()["id"]

    # 3. Admin approves claim
    verify_payload = {
        "status": "approved",
        "admin_notes": "Verified cat sticker on the back.",
    }
    verify_resp = client.post(
        f"/api/v1/admin/claims/{claim_id}/verify",
        json=verify_payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert verify_resp.status_code == 200
    assert verify_resp.json()["status"] == "approved"

    # 4. Check item status is reunited
    item_resp = client.get(f"/api/v1/items/{found_item_id}")
    assert item_resp.status_code == 200
    assert item_resp.json()["status"] == "reunited"

    # 5. Check audit trail
    history_resp = client.get(
        f"/api/v1/admin/items/{found_item_id}/history",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert history_resp.status_code == 200
    history = history_resp.json()
    assert len(history) >= 3  # Report Created -> Claim Initiated -> Approved by Admin
    assert history[-1]["action"] == "Approved by Admin"


def test_admin_verify_claim_reject(client, user_token, admin_token):
    # AC: Admin Ownership Verification Workflow - Reject Claim
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
        "proof_of_ownership": "It has a sticker of a dog on the back.",
    }
    claim_resp = client.post(
        "/api/v1/claims",
        json=claim_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert claim_resp.status_code == 201
    claim_id = claim_resp.json()["id"]

    # 3. Admin rejects claim
    verify_payload = {
        "status": "rejected",
        "rejection_reason": "Incorrect sticker description.",
        "admin_notes": "Sticker is a cat, not a dog.",
    }
    verify_resp = client.post(
        f"/api/v1/admin/claims/{claim_id}/verify",
        json=verify_payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert verify_resp.status_code == 200
    assert verify_resp.json()["status"] == "rejected"

    # 4. Check item status is unclaimed
    item_resp = client.get(f"/api/v1/items/{found_item_id}")
    assert item_resp.status_code == 200
    assert item_resp.json()["status"] == "unclaimed"
