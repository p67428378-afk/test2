from fastapi import status


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_items(client):
    # AC: List items with pagination and search/filter
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.get("/api/v1/items?skip=0&limit=10", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "items" in data
    assert data["total"] >= 3  # Seeded items
    assert len(data["items"]) <= 10


def test_list_items_search(client):
    # AC: Search items by name/SKU
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.get("/api/v1/items?search=Mouse", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["sku"] == "SKU-9901"


def test_create_item_admin(client):
    # AC: Admin can create a new item
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    response = client.post(
        "/api/v1/items",
        json={
            "sku": "SKU-9904",
            "name": "Gaming Monitor",
            "description": "144Hz gaming monitor",
            "category": "Electronics",
            "unit_price": 200.0,
            "reorder_threshold": 5,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["sku"] == "SKU-9904"


def test_create_item_staff_forbidden(client):
    # AC: Staff cannot create a new item (403)
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.post(
        "/api/v1/items",
        json={
            "sku": "SKU-9904",
            "name": "Gaming Monitor",
            "description": "144Hz gaming monitor",
            "category": "Electronics",
            "unit_price": 200.0,
            "reorder_threshold": 5,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_create_item_duplicate_sku(client):
    # AC: Creating an item with duplicate SKU fails
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    response = client.post(
        "/api/v1/items",
        json={
            "sku": "SKU-9901",  # Already seeded
            "name": "Duplicate Mouse",
            "unit_price": 25.0,
            "reorder_threshold": 10,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]


def test_update_item(client):
    # AC: Admin/Manager can update an existing item
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    # Get first item
    list_resp = client.get("/api/v1/items", headers=headers)
    item_id = list_resp.json()["items"][0]["id"]

    response = client.put(
        f"/api/v1/items/{item_id}",
        json={"name": "Updated Item Name", "unit_price": 99.99},
        headers=headers,
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["name"] == "Updated Item Name"
    assert response.json()["unit_price"] == 99.99


def test_delete_item_admin(client):
    # AC: Admin can delete an item
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    list_resp = client.get("/api/v1/items", headers=headers)
    item_id = list_resp.json()["items"][0]["id"]

    response = client.delete(f"/api/v1/items/{item_id}", headers=headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_delete_item_staff_forbidden(client):
    # AC: Staff cannot delete an item (403)
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    list_resp = client.get("/api/v1/items", headers=admin_headers)
    item_id = list_resp.json()["items"][0]["id"]

    response = client.delete(f"/api/v1/items/{item_id}", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
