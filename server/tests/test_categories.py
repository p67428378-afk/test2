def test_list_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Default seeded categories should be present
    assert len(data) >= 4
    category_names = [cat["name"] for cat in data]
    assert "Food & Dining" in category_names
    assert "Transport" in category_names


def test_create_category(client):
    payload = {
        "name": "Health & Medical",
        "description": "Pharmacy, doctor visits, health insurance"
    }
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Health & Medical"
    assert data["description"] == payload["description"]
    assert "id" in data
    assert "created_at" in data

    # Attempting to create duplicate category name should return 400
    duplicate_resp = client.post("/api/v1/categories", json=payload)
    assert duplicate_resp.status_code == 400
    assert "already exists" in duplicate_resp.json()["detail"]
