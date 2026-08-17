import pytest


@pytest.fixture
def auth_headers(client):
    # Register and login user
    client.post(
        "/api/v1/users/register",
        json={
            "email": "itemuser@example.com",
            "password": "password",
            "is_admin": False,
        },
    )
    response = client.post(
        "/api/v1/users/login",
        data={"username": "itemuser@example.com", "password": "password"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_item(client, auth_headers):
    response = client.post(
        "/api/v1/items",
        json={
            "item_type": "lost",
            "category": "Electronics",
            "color": "Black",
            "brand": "Apple",
            "description": "iPhone 13 Pro Max with a cracked screen",
            "location": "Central Park near the fountain",
            "item_date": "2026-01-15",
            "image_urls": ["https://example.com/iphone.jpg"],
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["category"] == "Electronics"
    assert data["color"] == "Black"
    assert data["brand"] == "Apple"
    assert len(data["images"]) == 1
    assert data["images"][0]["image_url"] == "https://example.com/iphone.jpg"


def test_list_items(client, auth_headers):
    # Create a lost item
    client.post(
        "/api/v1/items",
        json={
            "item_type": "lost",
            "category": "Electronics",
            "description": "Lost iPhone",
            "location": "Library",
            "item_date": "2026-01-15",
        },
        headers=auth_headers,
    )
    # Create a found item
    client.post(
        "/api/v1/items",
        json={
            "item_type": "found",
            "category": "Electronics",
            "description": "Found iPhone",
            "location": "Library",
            "item_date": "2026-01-15",
        },
        headers=auth_headers,
    )

    # List all items
    response = client.get("/api/v1/items")
    assert response.status_code == 200
    assert len(response.json()) >= 2

    # Filter by type
    response = client.get("/api/v1/items?item_type=lost")
    assert response.status_code == 200
    for item in response.json():
        assert item["item_type"] == "lost"


def test_ai_matching(client, auth_headers):
    # Create a lost item
    lost_resp = client.post(
        "/api/v1/items",
        json={
            "item_type": "lost",
            "category": "Electronics",
            "color": "Black",
            "brand": "Apple",
            "description": "iPhone 13 Pro Max with a cracked screen",
            "location": "Central Park near the fountain",
            "item_date": "2026-01-15",
        },
        headers=auth_headers,
    )
    lost_id = lost_resp.json()["id"]

    # Create a matching found item
    client.post(
        "/api/v1/items",
        json={
            "item_type": "found",
            "category": "Electronics",
            "color": "Black",
            "brand": "Apple",
            "description": "Found iPhone 13 Pro Max near the fountain",
            "location": "Central Park",
            "item_date": "2026-01-15",
        },
        headers=auth_headers,
    )

    # Get matches
    response = client.get(f"/api/v1/items/{lost_id}/matches")
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) > 0
    assert matches[0]["similarity_score"] > 50
    assert matches[0]["category"] == "Electronics"
    assert matches[0]["color"] == "Black"
    assert matches[0]["brand"] == "Apple"
