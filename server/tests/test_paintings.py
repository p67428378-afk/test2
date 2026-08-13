def test_get_paintings(client):
    response = client.get("/api/v1/paintings")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 4  # Seeded paintings
    assert len(data["items"]) >= 4


def test_get_painting_by_id(client):
    # Get all paintings first to find a valid ID
    response = client.get("/api/v1/paintings")
    data = response.json()
    painting_id = data["items"][0]["id"]

    response = client.get(f"/api/v1/paintings/{painting_id}")
    assert response.status_code == 200
    painting = response.json()
    assert painting["id"] == painting_id
    assert "title" in painting
    assert "price" in painting


def test_get_painting_not_found(client):
    response = client.get("/api/v1/paintings/non-existent-id")
    assert response.status_code == 404


def test_create_painting(client):
    payload = {
        "title": "Starry Night Over the Rhone",
        "description": "A beautiful night scene by Vincent van Gogh.",
        "artist_name": "Vincent van Gogh",
        "image_url": "https://example.com/starry_night.jpg",
        "dimensions": "28.5x36.2 in",
        "price": 1200.00,
        "stock": 1,
    }
    response = client.post("/api/v1/paintings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["artist_name"] == payload["artist_name"]
    assert float(data["price"]) == payload["price"]


def test_update_painting(client):
    # Get all paintings first to find a valid ID
    response = client.get("/api/v1/paintings")
    data = response.json()
    painting_id = data["items"][0]["id"]

    payload = {
        "title": "Updated Title",
        "description": "Updated description.",
        "artist_name": "Updated Artist",
        "image_url": "https://example.com/updated.jpg",
        "dimensions": "12x12 in",
        "price": 99.99,
        "stock": 5,
    }
    response = client.put(f"/api/v1/paintings/{painting_id}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert float(data["price"]) == 99.99


def test_delete_painting(client):
    # Create a painting to delete
    payload = {
        "title": "To Delete",
        "artist_name": "Artist",
        "image_url": "https://example.com/delete.jpg",
        "price": 10.00,
        "stock": 1,
    }
    create_resp = client.post("/api/v1/paintings", json=payload)
    painting_id = create_resp.json()["id"]

    response = client.delete(f"/api/v1/paintings/{painting_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Painting deleted successfully"

    # Verify it's gone
    get_resp = client.get(f"/api/v1/paintings/{painting_id}")
    assert get_resp.status_code == 404
