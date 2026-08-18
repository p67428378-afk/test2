from datetime import datetime, timezone


def get_auth_headers(client, email, password):
    client.post("/api/v1/auth/register", json={"email": email, "password": password})
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_claim_lifecycle_and_history(client):
    # AC: Admin Ownership Verification Workflow & Claim History & Audit Trail Maintenance
    user_headers = get_auth_headers(client, "claimant@example.com", "password123")
    admin_headers = get_auth_headers(client, "admin_user@example.com", "password123")
    # Update admin_user role to admin
    # Wait, we can register as admin directly or update role in DB.
    # Let's register as admin by passing role="admin" in register payload
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "real_admin@example.com",
            "password": "password123",
            "role": "admin",
        },
    )
    admin_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "real_admin@example.com", "password": "password123"},
    )
    real_admin_headers = {
        "Authorization": f"Bearer {admin_login_resp.json()['access_token']}"
    }

    # 1. Report found item
    found_payload = {
        "type": "found",
        "category": "Electronics",
        "description": "iPhone 13 Pro Max",
        "location": "Conference Room B",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": [],
    }
    found_resp = client.post("/api/v1/items", json=found_payload, headers=admin_headers)
    found_id = found_resp.json()["id"]

    # 2. Submit claim
    claim_payload = {
        "item_id": found_id,
        "proof": "I lost my blue iPhone 13 Pro Max with a cracked screen protector.",
    }
    claim_resp = client.post("/api/v1/claims", json=claim_payload, headers=user_headers)
    assert claim_resp.status_code == 201
    claim_id = claim_resp.json()["id"]
    assert claim_resp.json()["status"] == "pending"

    # 3. Verify item status is MATCH_PENDING
    item_resp = client.get(f"/api/v1/items/{found_id}", headers=user_headers)
    assert item_resp.json()["status"] == "MATCH_PENDING"

    # 4. Admin approves claim
    verify_payload = {
        "status": "approved",
        "notes": "Proof verified. Serial number matches.",
    }
    verify_resp = client.patch(
        f"/api/v1/claims/{claim_id}/verify",
        json=verify_payload,
        headers=real_admin_headers,
    )
    assert verify_resp.status_code == 200
    assert verify_resp.json()["status"] == "approved"

    # 5. Verify item status is CLAIMED
    item_resp = client.get(f"/api/v1/items/{found_id}", headers=user_headers)
    assert item_resp.json()["status"] == "CLAIMED"

    # 6. Get claim history
    history_resp = client.get(
        f"/api/v1/claims/{claim_id}/history", headers=user_headers
    )
    assert history_resp.status_code == 200
    history = history_resp.json()
    assert len(history) >= 2
    assert history[0]["event_type"] == "CLAIM_SUBMITTED"
    assert history[1]["event_type"] == "VERIFIED_BY_ADMIN"


def test_concurrent_claims_superseded(client):
    # AC: Claim History & Audit Trail Maintenance - Edge Case: Approving one claim automatically marks other pending claims as SUPERSEDED_CLOSED
    user1_headers = get_auth_headers(client, "claimant1@example.com", "password123")
    user2_headers = get_auth_headers(client, "claimant2@example.com", "password123")
    admin_headers = get_auth_headers(client, "admin_user2@example.com", "password123")

    client.post(
        "/api/v1/auth/register",
        json={
            "email": "real_admin2@example.com",
            "password": "password123",
            "role": "admin",
        },
    )
    admin_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "real_admin2@example.com", "password": "password123"},
    )
    real_admin_headers = {
        "Authorization": f"Bearer {admin_login_resp.json()['access_token']}"
    }

    # 1. Report found item
    found_payload = {
        "type": "found",
        "category": "Keys",
        "description": "Car keys with a Toyota fob",
        "location": "Parking Lot",
        "item_timestamp": datetime.now(timezone.utc).isoformat(),
        "images": [],
    }
    found_resp = client.post("/api/v1/items", json=found_payload, headers=admin_headers)
    found_id = found_resp.json()["id"]

    # 2. Submit claim 1
    claim1_resp = client.post(
        "/api/v1/claims",
        json={"item_id": found_id, "proof": "My Toyota keys"},
        headers=user1_headers,
    )
    claim1_id = claim1_resp.json()["id"]

    # 3. Submit claim 2
    claim2_resp = client.post(
        "/api/v1/claims",
        json={"item_id": found_id, "proof": "Also my Toyota keys"},
        headers=user2_headers,
    )
    claim2_id = claim2_resp.json()["id"]

    # 4. Admin approves claim 1
    client.patch(
        f"/api/v1/claims/{claim1_id}/verify",
        json={"status": "approved", "notes": "Approved claim 1"},
        headers=real_admin_headers,
    )

    # 5. Verify claim 2 is superseded_closed
    claim2_check = client.get(f"/api/v1/claims/{claim2_id}", headers=user2_headers)
    assert claim2_check.json()["status"] == "superseded_closed"

    # 6. Verify claim 2 history has SUPERSEDED_CLOSED event
    history_resp = client.get(
        f"/api/v1/claims/{claim2_id}/history", headers=user2_headers
    )
    history = history_resp.json()
    assert any(h["event_type"] == "SUPERSEDED_CLOSED" for h in history)
