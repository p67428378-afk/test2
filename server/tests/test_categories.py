def test_get_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4  # Seeded categories (Food & Dining, Transport, Utilities, Entertainment)
    names = [cat["name"] for cat in data]
    assert "Food & Dining" in names


def test_create_category(client):
    payload = {
        "name": "Health & Medical",
        "description": "Doctor visits, pharmacy, insurance",
    }
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_create_duplicate_category(client):
    payload = {
        "name": "Food & Dining",
        "description": "Duplicate food category",
    }
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]
