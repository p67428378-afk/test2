
from fastapi.testclient import TestClient
from server.main import app
import uuid

client = TestClient(app)

def test_create_order():
    response = client.post(
        "/api/v1/orders/",
        json={"instrument_id": "AAPL", "quantity": 100, "price": 175.50, "order_type": "LIMIT"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["instrument_id"] == "AAPL"
    assert "id" in data

def test_read_order():
    # First create an order to have something to read
    response = client.post(
        "/api/v1/orders/",
        json={"instrument_id": "GOOG", "quantity": 50, "price": 1400.00, "order_type": "LIMIT"},
    )
    order_id = response.json()["id"]

    response = client.get(f"/api/v1/orders/{order_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["instrument_id"] == "GOOG"
    assert data["id"] == order_id
