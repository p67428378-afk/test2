def test_create_and_get_preference(client):
    user_id = "test_user_001"
    payload = {
        "user_id": user_id,
        "category_preferences": ["electronics", "gadgets"],
        "min_price": 50.0,
        "max_price": 300.0,
        "preferred_tags": ["wireless", "portable", "audio"],
    }
    # Create
    res = client.post("/api/v1/preferences", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["user_id"] == user_id
    assert "electronics" in data["category_preferences"]
    assert data["min_price"] == 50.0
    assert data["max_price"] == 300.0
    assert "wireless" in data["preferred_tags"]
    assert "id" in data

    # Get
    get_res = client.get(f"/api/v1/preferences/{user_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["user_id"] == user_id
    assert get_data["category_preferences"] == ["electronics", "gadgets"]


def test_update_existing_preference(client):
    user_id = "test_user_002"
    payload_1 = {
        "user_id": user_id,
        "category_preferences": ["books"],
        "min_price": 10.0,
        "max_price": 50.0,
        "preferred_tags": ["educational"],
    }
    res1 = client.post("/api/v1/preferences", json=payload_1)
    assert res1.status_code == 201

    payload_2 = {
        "user_id": user_id,
        "category_preferences": ["books", "electronics"],
        "min_price": 20.0,
        "max_price": 100.0,
        "preferred_tags": ["educational", "ai"],
    }
    res2 = client.post("/api/v1/preferences", json=payload_2)
    assert res2.status_code == 201
    data2 = res2.json()
    assert data2["min_price"] == 20.0
    assert data2["max_price"] == 100.0
    assert "electronics" in data2["category_preferences"]


def test_get_preference_not_found(client):
    res = client.get("/api/v1/preferences/non_existent_user_99999")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


def test_create_preference_invalid_prices(client):
    # min_price > max_price
    payload = {
        "user_id": "test_user_bad_prices",
        "category_preferences": ["books"],
        "min_price": 200.0,
        "max_price": 50.0,
        "preferred_tags": [],
    }
    res = client.post("/api/v1/preferences", json=payload)
    assert res.status_code == 400
    assert "min_price cannot be greater" in res.json()["detail"]


def test_create_preference_empty_user_id(client):
    payload = {
        "user_id": "",
        "category_preferences": ["electronics"],
        "min_price": 10.0,
        "max_price": 100.0,
        "preferred_tags": [],
    }
    res = client.post("/api/v1/preferences", json=payload)
    assert res.status_code in [400, 422]
