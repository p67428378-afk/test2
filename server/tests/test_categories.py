def test_list_categories(client, auth_headers):
    response = client.get("/api/v1/categories", headers=auth_headers)
    assert response.status_code == 200
    cats = response.json()
    assert isinstance(cats, list)
    assert len(cats) > 0


def test_list_categories_filter_by_type(client, auth_headers):
    response = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    assert response.status_code == 200
    cats = response.json()
    assert all(c["type"] == "Expense" for c in cats)


def test_create_category(client, auth_headers):
    response = client.post(
        "/api/v1/categories",
        headers=auth_headers,
        json={"name": "Custom Investment", "type": "Income"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Custom Investment"
    assert data["type"] == "Income"
    assert "id" in data


def test_update_category(client, auth_headers):
    # Create category first
    create_res = client.post(
        "/api/v1/categories",
        headers=auth_headers,
        json={"name": "Old Category Name", "type": "Expense"},
    )
    cat_id = create_res.json()["id"]

    # Update category
    update_res = client.put(
        f"/api/v1/categories/{cat_id}",
        headers=auth_headers,
        json={"name": "New Category Name"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "New Category Name"


def test_delete_category(client, auth_headers):
    create_res = client.post(
        "/api/v1/categories",
        headers=auth_headers,
        json={"name": "To Delete", "type": "Expense"},
    )
    cat_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/categories/{cat_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify not found on update
    upd_res = client.put(
        f"/api/v1/categories/{cat_id}",
        headers=auth_headers,
        json={"name": "Will Fail"},
    )
    assert upd_res.status_code == 404
