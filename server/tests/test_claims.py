import pytest


@pytest.fixture
def user_headers(client):
    # Register and login regular user
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "password", "is_admin": False},
    )
    response = client.post(
        "/api/v1/users/login",
        data={"username": "user@example.com", "password": "password"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(client):
    # Register and login admin user
    client.post(
        "/api/v1/users/register",
        json={
            "email": "admin_test@example.com",
            "password": "password",
            "is_admin": True,
        },
    )
    response = client.post(
        "/api/v1/users/login",
        data={"username": "admin_test@example.com", "password": "password"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_verify_claim(client, user_headers, admin_headers):
    # Create a found item
    item_resp = client.post(
        "/api/v1/items",
        json={
            "item_type": "found",
            "category": "Keys",
            "description": "Car keys found in the parking lot",
            "location": "Parking Lot",
            "item_date": "2026-01-15",
        },
        headers=user_headers,
    )
    item_id = item_resp.json()["id"]

    # Submit a claim
    claim_resp = client.post(
        "/api/v1/claims", json={"item_id": item_id}, headers=user_headers
    )
    assert claim_resp.status_code == 201
    claim_id = claim_resp.json()["id"]
    assert claim_resp.json()["status"] == "pending"

    # List claims as admin
    claims_list_resp = client.get("/api/v1/claims", headers=admin_headers)
    assert claims_list_resp.status_code == 200
    assert len(claims_list_resp.json()) > 0

    # Verify claim as admin
    verify_resp = client.put(
        f"/api/v1/claims/{claim_id}/verify",
        json={"status": "approved"},
        headers=admin_headers,
    )
    assert verify_resp.status_code == 200
    assert verify_resp.json()["status"] == "approved"

    # Check item status is now returned
    item_detail_resp = client.get(f"/api/v1/items/{item_id}")
    assert item_detail_resp.json()["status"] == "returned"


def test_anonymous_chat(client, user_headers, admin_headers):
    # Create a found item
    item_resp = client.post(
        "/api/v1/items",
        json={
            "item_type": "found",
            "category": "Keys",
            "description": "Car keys found in the parking lot",
            "location": "Parking Lot",
            "item_date": "2026-01-15",
        },
        headers=user_headers,
    )
    item_id = item_resp.json()["id"]

    # Submit a claim
    claim_resp = client.post(
        "/api/v1/claims", json={"item_id": item_id}, headers=user_headers
    )
    claim_id = claim_resp.json()["id"]

    # Send message as user
    msg_resp = client.post(
        f"/api/v1/claims/{claim_id}/messages",
        json={"text": "Hello, I lost my keys there. Can you verify?"},
        headers=user_headers,
    )
    assert msg_resp.status_code == 201
    assert msg_resp.json()["text"] == "Hello, I lost my keys there. Can you verify?"

    # Send message as admin
    msg_admin_resp = client.post(
        f"/api/v1/claims/{claim_id}/messages",
        json={"text": "Sure, what brand is the key fob?"},
        headers=admin_headers,
    )
    assert msg_admin_resp.status_code == 201

    # Get messages as user
    messages_resp = client.get(
        f"/api/v1/claims/{claim_id}/messages", headers=user_headers
    )
    assert messages_resp.status_code == 200
    assert len(messages_resp.json()) == 2
