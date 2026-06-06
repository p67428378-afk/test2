
from fastapi.testclient import TestClient
from server.main import app
from server.tests.conftest import client, test_db
import uuid

def test_read_inventory(client, test_db):
    response = client.get("/api/v1/inventory/")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_consume_item(client, test_db):
    db, item_id = test_db
    response = client.put(f"/api/v1/inventory/{item_id}/consume", json={"quantity_consumed": 5})
    assert response.status_code == 200
    assert response.json() == {"message": f"Successfully consumed 5 of item {item_id}"}

def test_update_item(client, test_db):
    db, item_id = test_db
    response = client.put(f"/api/v1/inventory/{item_id}", json={"expiry_date": "2025-12-31T12:00:00"})
    assert response.status_code == 200
    assert response.json() == {"message": f"Successfully updated item {item_id}"}
