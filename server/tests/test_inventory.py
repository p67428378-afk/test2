from fastapi.testclient import TestClient


def _get_token(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_create_inventory_item_unauthorized(client: TestClient):
    # No token
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Sterile Gloves",
            "description": "Box of 100 sterile gloves",
            "quantity": 50,
            "unit": "box",
            "supplier": "Medline",
            "category": "PPE",
            "low_stock_threshold": 10,
        },
    )
    assert response.status_code == 401


def test_create_inventory_item_forbidden_for_member(client: TestClient):
    # Member token
    token = _get_token(client, "test@example.com", "testpassword")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Sterile Gloves",
            "description": "Box of 100 sterile gloves",
            "quantity": 50,
            "unit": "box",
            "supplier": "Medline",
            "category": "PPE",
            "low_stock_threshold": 10,
        },
        headers=headers,
    )
    assert response.status_code == 403


def test_create_inventory_item_success(client: TestClient):
    # Librarian token
    token = _get_token(client, "admin@example.com", "adminpassword")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Sterile Gloves",
            "description": "Box of 100 sterile gloves",
            "quantity": 50,
            "unit": "box",
            "supplier": "Medline",
            "category": "PPE",
            "low_stock_threshold": 10,
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Sterile Gloves"
    assert data["quantity"] == 50
    assert data["is_low_stock"] is False


def test_create_inventory_item_invalid_quantity(client: TestClient):
    token = _get_token(client, "admin@example.com", "adminpassword")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Sterile Gloves",
            "description": "Box of 100 sterile gloves",
            "quantity": -5,
            "unit": "box",
            "supplier": "Medline",
            "category": "PPE",
            "low_stock_threshold": 10,
        },
        headers=headers,
    )
    assert response.status_code == 422


def test_get_inventory_items(client: TestClient):
    token = _get_token(client, "test@example.com", "testpassword")
    headers = {"Authorization": f"Bearer {token}"}

    # Create an item first
    admin_token = _get_token(client, "admin@example.com", "adminpassword")
    client.post(
        "/api/v1/inventory",
        json={
            "name": "Surgical Mask",
            "description": "Box of 50 surgical masks",
            "quantity": 5,
            "unit": "box",
            "supplier": "3M",
            "category": "PPE",
            "low_stock_threshold": 10,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    response = client.get("/api/v1/inventory", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    # Check low stock logic
    mask_item = [item for item in data if item["name"] == "Surgical Mask"][0]
    assert mask_item["is_low_stock"] is True


def test_get_inventory_item_by_id(client: TestClient):
    token = _get_token(client, "test@example.com", "testpassword")
    headers = {"Authorization": f"Bearer {token}"}

    # Create an item first
    admin_token = _get_token(client, "admin@example.com", "adminpassword")
    create_res = client.post(
        "/api/v1/inventory",
        json={
            "name": "Syringe 5ml",
            "description": "Pack of 100 syringes",
            "quantity": 100,
            "unit": "pack",
            "supplier": "BD",
            "category": "Consumables",
            "low_stock_threshold": 20,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    item_id = create_res.json()["item_id"]

    response = client.get(f"/api/v1/inventory/{item_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Syringe 5ml"


def test_update_inventory_item(client: TestClient):
    admin_token = _get_token(client, "admin@example.com", "adminpassword")
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create an item first
    create_res = client.post(
        "/api/v1/inventory",
        json={
            "name": "Scalpel",
            "description": "Surgical scalpel size 10",
            "quantity": 15,
            "unit": "piece",
            "supplier": "Braun",
            "category": "Instruments",
            "low_stock_threshold": 5,
        },
        headers=headers,
    )
    item_id = create_res.json()["item_id"]

    # Update quantity to 3 (low stock)
    response = client.put(
        f"/api/v1/inventory/{item_id}",
        json={"quantity": 3},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 3
    assert data["is_low_stock"] is True


def test_delete_inventory_item(client: TestClient):
    admin_token = _get_token(client, "admin@example.com", "adminpassword")
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create an item first
    create_res = client.post(
        "/api/v1/inventory",
        json={
            "name": "Defibrillator",
            "description": "Automated external defibrillator",
            "quantity": 2,
            "unit": "unit",
            "supplier": "Philips",
            "category": "Equipment",
            "low_stock_threshold": 1,
        },
        headers=headers,
    )
    item_id = create_res.json()["item_id"]

    # Delete item
    response = client.delete(f"/api/v1/inventory/{item_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Item deleted successfully"

    # Verify deleted
    get_res = client.get(
        f"/api/v1/inventory/{item_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert get_res.status_code == 404
