
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_item():
    response = client.post(
        "/api/v1/items/",
        json={
            "name": "Gold Ring",
            "type": "Ring",
            "material": "Gold",
            "weight": 5.5,
            "cost": 250.0,
            "selling_price": 450.0,
            "stock_level": 10,
            "location": "Store A"
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Gold Ring"

def test_read_items():
    response = client.get("/api/v1/items/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
