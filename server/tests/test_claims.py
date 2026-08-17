from fastapi import status
import uuid


def test_submit_claim(client):
    # Create a found item
    item_res = client.post(
        "/api/v1/items",
        json={
            "name": "Found Wallet",
            "category": "Wallet",
            "location": "Library",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "test@example.com",
            "status": "found",
        },
    )
    item = item_res.json()

    # Submit claim
    payload = {
        "item_id": item["id"],
        "claimant_details": "John Doe, john@example.com",
        "claim_date": "2026-08-16T10:00:00Z",
    }
    response = client.post("/api/v1/claims", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["status"] == "pending"
    assert data["claimant_details"] == "John Doe, john@example.com"


def test_submit_claim_item_not_found(client):
    payload = {
        "item_id": str(uuid.uuid4()),
        "claimant_details": "John Doe, john@example.com",
        "claim_date": "2026-08-16T10:00:00Z",
    }
    response = client.post("/api/v1/claims", json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_verify_claim(client):
    # Create a found item
    item_res = client.post(
        "/api/v1/items",
        json={
            "name": "Found Wallet",
            "category": "Wallet",
            "location": "Library",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "test@example.com",
            "status": "found",
        },
    )
    item = item_res.json()

    # Submit claim
    claim_res = client.post(
        "/api/v1/claims",
        json={
            "item_id": item["id"],
            "claimant_details": "John Doe, john@example.com",
            "claim_date": "2026-08-16T10:00:00Z",
        },
    )
    claim = claim_res.json()

    # Verify claim (approve)
    response = client.put(
        f"/api/v1/claims/{claim['id']}/verify", json={"status": "approved"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "approved"

    # Try to submit another claim for the same item (should fail with 400)
    response2 = client.post(
        "/api/v1/claims",
        json={
            "item_id": item["id"],
            "claimant_details": "Jane Doe, jane@example.com",
            "claim_date": "2026-08-17T10:00:00Z",
        },
    )
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
