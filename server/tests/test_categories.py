def test_get_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 7
    names = [cat["name"] for cat in data]
    assert "Food & Dining" in names
    assert "Transportation" in names


def test_create_category_success(client):
    payload = {"name": "Gym & Fitness", "color": "#10B981", "icon": "dumbbell"}
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Gym & Fitness"
    assert data["color"] == "#10B981"
    assert data["icon"] == "dumbbell"
    assert data["is_default"] is False
    assert "id" in data


def test_create_category_duplicate_name(client):
    payload = {"name": "Food & Dining"}
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_create_category_blank_name(client):
    payload = {"name": "   "}
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 422


def test_get_category_by_id(client):
    # Get an existing category
    list_resp = client.get("/api/v1/categories")
    cat_id = list_resp.json()[0]["id"]

    response = client.get(f"/api/v1/categories/{cat_id}")
    assert response.status_code == 200
    assert response.json()["id"] == cat_id


def test_get_category_not_found(client):
    response = client.get("/api/v1/categories/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_update_category(client):
    # Create a custom category first
    cat_resp = client.post(
        "/api/v1/categories",
        json={"name": "Pets", "color": "#F59E0B", "icon": "paw"},
    )
    cat_id = cat_resp.json()["id"]

    # Update category
    update_resp = client.put(
        f"/api/v1/categories/{cat_id}",
        json={"name": "Pets & Animals", "color": "#E11D48"},
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["name"] == "Pets & Animals"
    assert data["color"] == "#E11D48"


def test_delete_custom_category(client):
    # Create custom category
    cat_resp = client.post(
        "/api/v1/categories",
        json={"name": "Temporary Hobby", "color": "#9333EA", "icon": "sparkles"},
    )
    cat_id = cat_resp.json()["id"]

    # Delete
    del_resp = client.delete(f"/api/v1/categories/{cat_id}")
    assert del_resp.status_code == 204

    # Verify not found
    get_resp = client.get(f"/api/v1/categories/{cat_id}")
    assert get_resp.status_code == 404


def test_delete_default_category_fails(client):
    list_resp = client.get("/api/v1/categories")
    default_cat = next(c for c in list_resp.json() if c["is_default"])
    del_resp = client.delete(f"/api/v1/categories/{default_cat['id']}")
    assert del_resp.status_code == 400
    assert "Cannot delete default" in del_resp.json()["detail"]
