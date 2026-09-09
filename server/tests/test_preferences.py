"""Tests for User Preferences API endpoints."""


def test_create_and_get_user_preferences(client):
    """Verify creating and fetching user preference profile."""
    user_id = "test_user_pref_001"
    payload = {
        "user_id": user_id,
        "category_preferences": ["electronics", "gadgets"],
        "min_price": 50.0,
        "max_price": 500.0,
        "preferred_tags": ["wireless", "audio"],
    }
    create_res = client.post("/api/v1/preferences", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["user_id"] == user_id
    assert "electronics" in data["category_preferences"]
    assert data["min_price"] == 50.0
    assert data["max_price"] == 500.0

    # Fetch preference
    get_res = client.get(f"/api/v1/preferences/{user_id}")
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["user_id"] == user_id
    assert fetched["preferred_tags"] == ["wireless", "audio"]


def test_update_existing_preferences(client):
    """Verify submitting preferences for existing user updates the profile."""
    user_id = "test_user_pref_update"
    payload_1 = {
        "user_id": user_id,
        "category_preferences": ["books"],
        "min_price": 10.0,
        "max_price": 50.0,
        "preferred_tags": ["education"],
    }
    client.post("/api/v1/preferences", json=payload_1)

    # Update preferences
    payload_2 = {
        "user_id": user_id,
        "category_preferences": ["books", "electronics"],
        "min_price": 20.0,
        "max_price": 200.0,
        "preferred_tags": ["education", "ai"],
    }
    update_res = client.post("/api/v1/preferences", json=payload_2)
    assert update_res.status_code == 201

    get_res = client.get(f"/api/v1/preferences/{user_id}")
    assert get_res.status_code == 200
    assert "electronics" in get_res.json()["category_preferences"]
    assert get_res.json()["max_price"] == 200.0


def test_invalid_price_range_preferences(client):
    """Verify 400 Bad Request when min_price is greater than max_price."""
    payload = {
        "user_id": "invalid_pref_user",
        "category_preferences": ["electronics"],
        "min_price": 500.0,
        "max_price": 50.0,
        "preferred_tags": ["audio"],
    }
    response = client.post("/api/v1/preferences", json=payload)
    assert response.status_code == 400


def test_get_non_existent_preferences(client):
    """Verify 404 response when querying preferences for unknown user."""
    response = client.get("/api/v1/preferences/unknown_user_99999")
    assert response.status_code == 404
