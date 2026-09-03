import pytest


def test_list_categories_alphabetical(client):
    """Verify GET /api/v1/categories returns categories sorted alphabetically."""
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2

    # Verify initial seed categories 'Bike' and 'Car' are present
    names = [c["name"] for c in data]
    assert "Bike" in names
    assert "Car" in names

    # Verify alphabetical sorting (case-insensitive)
    assert names == sorted(names, key=lambda x: x.lower())

    # Verify UUID format and timestamps
    for cat in data:
        assert "id" in cat
        assert "name" in cat
        assert "created_at" in cat
        assert "updated_at" in cat
        assert len(cat["id"]) == 36  # UUID v4 string length


def test_create_category_success(client):
    """Verify POST /api/v1/categories creates a new category."""
    new_cat = {"name": "Scooter"}
    response = client.post("/api/v1/categories", json=new_cat)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Scooter"
    assert "id" in data
    assert len(data["id"]) == 36
    assert "created_at" in data
    assert "updated_at" in data

    # Verify it now appears in the list
    list_res = client.get("/api/v1/categories")
    names = [c["name"] for c in list_res.json()]
    assert "Scooter" in names


def test_create_duplicate_category_case_insensitive(client):
    """Verify POST /api/v1/categories returns 409 Conflict for case-insensitive duplicates."""
    # Attempting to create 'car' when 'Car' exists
    response_lower = client.post("/api/v1/categories", json={"name": "car"})
    assert response_lower.status_code == 409
    assert "already exists" in response_lower.json()["detail"].lower()

    # Attempting to create 'BIKE' when 'Bike' exists
    response_upper = client.post("/api/v1/categories", json={"name": "BIKE"})
    assert response_upper.status_code == 409
    assert "already exists" in response_upper.json()["detail"].lower()


def test_create_category_validation(client):
    """Verify invalid payloads return 422 Unprocessable Entity."""
    # Empty string
    response_empty = client.post("/api/v1/categories", json={"name": ""})
    assert response_empty.status_code == 422

    # Whitespace only
    response_ws = client.post("/api/v1/categories", json={"name": "   "})
    assert response_ws.status_code == 422

    # Missing name field
    response_missing = client.post("/api/v1/categories", json={})
    assert response_missing.status_code == 422


def test_get_category_by_id(client):
    """Verify GET /api/v1/categories/{category_id} returns category or 404."""
    # List categories and pick the first one
    list_res = client.get("/api/v1/categories")
    first_cat = list_res.json()[0]

    # Fetch by ID
    get_res = client.get(f"/api/v1/categories/{first_cat['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == first_cat["id"]
    assert get_res.json()["name"] == first_cat["name"]

    # Fetch non-existent ID
    non_existent_res = client.get("/api/v1/categories/00000000-0000-0000-0000-000000000000")
    assert non_existent_res.status_code == 404
