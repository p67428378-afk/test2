def test_list_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Check default categories seeded
    names = [c["name"] for c in data]
    assert "Food & Dining" in names
    assert "Transport" in names


def test_create_category(client):
    payload = {"name": "Custom Category Test", "description": "Test description"}
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_create_duplicate_category_fails(client):
    payload = {"name": "Food & Dining", "description": "Duplicate"}
    response = client.post("/api/v1/categories", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_get_category_by_id(client):
    # First list to get an existing category id
    res = client.get("/api/v1/categories")
    cat_id = res.json()[0]["id"]

    get_res = client.get(f"/api/v1/categories/{cat_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == cat_id


def test_get_nonexistent_category_fails(client):
    res = client.get("/api/v1/categories/nonexistent-uuid")
    assert res.status_code == 404


def test_update_category(client):
    # Create category first
    create_res = client.post(
        "/api/v1/categories", json={"name": "Temp Cat", "description": "old"}
    )
    cat_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/categories/{cat_id}", json={"description": "new description"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["description"] == "new description"


def test_delete_category(client):
    create_res = client.post(
        "/api/v1/categories", json={"name": "Delete Cat", "description": "del"}
    )
    cat_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/categories/{cat_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/categories/{cat_id}")
    assert get_res.status_code == 404
