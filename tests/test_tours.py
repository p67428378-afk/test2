"""Unit and integration tests for Tour management APIs."""


def test_list_tours(client):
    """Test retrieving list of available tours."""
    response = client.get("/api/v1/tours")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "title" in data[0]
    assert "duration_minutes" in data[0]


def test_create_tour(client):
    """Test creating a new tour route definition."""
    payload = {
        "title": "Medieval Armor & Weapons",
        "description": "Guided exploration of medieval armory, knight armor, and historical weaponry.",
        "duration_minutes": 45,
    }
    response = client.post("/api/v1/tours", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["duration_minutes"] == 45
    assert "id" in data


def test_get_tour_by_id(client):
    """Test getting a specific tour by ID."""
    # First create a tour
    payload = {
        "title": "Greek & Roman Sculptures",
        "description": "Classical antiquities and marble statues.",
        "duration_minutes": 60,
    }
    create_res = client.post("/api/v1/tours", json=payload)
    assert create_res.status_code == 201
    tour_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/tours/{tour_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == tour_id
    assert get_res.json()["title"] == payload["title"]


def test_get_nonexistent_tour(client):
    """Test 404 response for nonexistent tour."""
    response = client.get("/api/v1/tours/non-existent-tour-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Tour not found"


def test_update_tour(client):
    """Test updating tour route details."""
    create_res = client.post(
        "/api/v1/tours",
        json={"title": "Temporary Exhibit", "description": "Temp", "duration_minutes": 30},
    )
    tour_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/tours/{tour_id}",
        json={"title": "Updated Exhibit Title", "duration_minutes": 50},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Exhibit Title"
    assert update_res.json()["duration_minutes"] == 50


def test_delete_tour(client):
    """Test deleting a tour route."""
    create_res = client.post(
        "/api/v1/tours",
        json={"title": "To Be Deleted", "description": "Temp", "duration_minutes": 30},
    )
    tour_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/tours/{tour_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/tours/{tour_id}")
    assert get_res.status_code == 404
