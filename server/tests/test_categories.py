def test_list_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    category_names = [cat["name"] for cat in data]
    assert "Hill Stations" in category_names
    assert "Backwaters" in category_names


def test_get_category_by_id(client):
    list_res = client.get("/api/v1/categories")
    categories = list_res.json()
    cat_id = categories[0]["id"]

    response = client.get(f"/api/v1/categories/{cat_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == cat_id
    assert "name" in data


def test_get_category_not_found(client):
    response = client.get("/api/v1/categories/invalid-uuid-12345")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category with ID invalid-uuid-12345 not found"


def test_create_category(client):
    new_cat = {
        "name": "Adventure & Trekking",
        "slug": "adventure-trekking",
        "description": "Trekking routes, rock climbing, and outdoor sports.",
    }
    response = client.post("/api/v1/categories", json=new_cat)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Adventure & Trekking"
    assert data["slug"] == "adventure-trekking"
    assert "id" in data


def test_create_duplicate_category_slug(client):
    cat_data = {
        "name": "Hill Stations Duplicate",
        "slug": "hill-stations",  # Already seeded
        "description": "Duplicate slug test",
    }
    response = client.post("/api/v1/categories", json=cat_data)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]
