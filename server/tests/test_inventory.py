from fastapi import status
from server.models import Warehouse, Item, Inventory


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_inventory(client):
    # AC: The system shall maintain real-time visibility into current stock quantities across all inventory items and warehouses
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.get("/api/v1/inventory", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 6  # 3 items * 2 warehouses seeded


def test_get_low_stock_items(client, db_session):
    # AC: Automatically generate alerts when stock levels fall below specified reorder thresholds
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Let's find an item and set its stock below threshold
    item = db_session.query(Item).filter(Item.sku == "SKU-9901").first()
    warehouse = db_session.query(Warehouse).first()

    # Set stock to 5 (threshold is 10)
    inv = (
        db_session.query(Inventory)
        .filter(Inventory.item_id == item.id, Inventory.warehouse_id == warehouse.id)
        .first()
    )
    inv.current_stock = 5
    db_session.commit()

    response = client.get("/api/v1/inventory/low-stock", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    alert = [
        a for a in data if a["sku"] == "SKU-9901" and a["warehouse"] == warehouse.name
    ][0]
    assert alert["current_stock"] == 5
    assert alert["threshold"] == 10
    assert alert["status"] == "Low Stock"


def test_update_stock_level(client, db_session):
    # AC: The system shall maintain real-time visibility into current stock quantities across all inventory items and warehouses
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    item = db_session.query(Item).filter(Item.sku == "SKU-9901").first()
    warehouse = db_session.query(Warehouse).first()

    response = client.put(
        f"/api/v1/inventory/{item.id}",
        json={"warehouse_id": warehouse.id, "current_stock": 50},
        headers=headers,
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["current_stock"] == 50

    # Verify in DB
    inv = (
        db_session.query(Inventory)
        .filter(Inventory.item_id == item.id, Inventory.warehouse_id == warehouse.id)
        .first()
    )
    assert inv.current_stock == 50


def test_record_stock_adjustment(client, db_session):
    # AC: Log all manual stock adjustments, transfers, and inventory reconciliations with timestamp, user ID, and reason codes
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    item = db_session.query(Item).filter(Item.sku == "SKU-9901").first()
    warehouse = db_session.query(Warehouse).first()

    # Get initial stock
    inv = (
        db_session.query(Inventory)
        .filter(Inventory.item_id == item.id, Inventory.warehouse_id == warehouse.id)
        .first()
    )
    initial_stock = inv.current_stock

    response = client.post(
        f"/api/v1/inventory/{item.id}/adjust",
        json={
            "warehouse_id": warehouse.id,
            "adjustment_type": "addition",
            "quantity": 10,
            "reason_code": "NEW_STOCK",
            "notes": "Received new shipment",
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["quantity"] == 10
    assert response.json()["adjustment_type"] == "addition"

    # Verify stock updated
    db_session.refresh(inv)
    assert inv.current_stock == initial_stock + 10


def test_list_adjustments(client, db_session):
    # AC: Log all manual stock adjustments and list them in audit log
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    item = db_session.query(Item).filter(Item.sku == "SKU-9901").first()
    warehouse = db_session.query(Warehouse).first()

    # Record an adjustment
    client.post(
        f"/api/v1/inventory/{item.id}/adjust",
        json={
            "warehouse_id": warehouse.id,
            "adjustment_type": "reduction",
            "quantity": 2,
            "reason_code": "DAMAGED_GOODS",
            "notes": "Damaged in transit",
        },
        headers=headers,
    )

    response = client.get("/api/v1/inventory/adjustments", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    adj = [
        a for a in data if a["sku"] == "SKU-9901" and a["reason"] == "DAMAGED_GOODS"
    ][0]
    assert adj["change"] == -2
    assert adj["warehouse"] == warehouse.name
    assert adj["user"] == "Test User"


def test_transfer_stock(client, db_session):
    # AC: Log all manual stock adjustments, transfers, and inventory reconciliations
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    item = db_session.query(Item).filter(Item.sku == "SKU-9901").first()
    wh_a = db_session.query(Warehouse).filter(Warehouse.name == "Warehouse A").first()
    wh_b = db_session.query(Warehouse).filter(Warehouse.name == "Warehouse B").first()

    # Set initial stock in Warehouse A to 20
    inv_a = (
        db_session.query(Inventory)
        .filter(Inventory.item_id == item.id, Inventory.warehouse_id == wh_a.id)
        .first()
    )
    inv_a.current_stock = 20
    db_session.commit()

    response = client.post(
        f"/api/v1/inventory/{item.id}/transfer",
        json={
            "source_warehouse_id": wh_a.id,
            "destination_warehouse_id": wh_b.id,
            "quantity": 5,
            "notes": "Transferring stock for order fulfillment",
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert "Successfully transferred" in response.json()["message"]

    # Verify stock levels updated
    db_session.refresh(inv_a)
    assert inv_a.current_stock == 15

    inv_b = (
        db_session.query(Inventory)
        .filter(Inventory.item_id == item.id, Inventory.warehouse_id == wh_b.id)
        .first()
    )
    assert inv_b.current_stock == 20  # Seeded 15 + 5 transferred
