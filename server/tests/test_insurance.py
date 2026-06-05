from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_premium_success():
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={"vehicle_value": 25000, "ncb_percentage": 20, "vehicle_multiplier": 1.0},
    )
    assert response.status_code == 200
    assert "calculated_premium" in response.json()
    assert response.json()["calculated_premium"] == 400.0

def test_calculate_premium_invalid_multiplier():
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={"vehicle_value": 25000, "ncb_percentage": 20, "vehicle_multiplier": 0.7},
    )
    assert response.status_code == 400
    assert "Vehicle multiplier must be between 0.8 and 1.6" in response.json()["detail"]

def test_calculate_premium_invalid_ncb():
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={"vehicle_value": 25000, "ncb_percentage": 10, "vehicle_multiplier": 1.0},
    )
    assert response.status_code == 400
    assert "NCB percentage must be between 20 and 50" in response.json()["detail"]

def test_calculate_premium_missing_field():
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={"vehicle_value": 25000, "ncb_percentage": 20},
    )
    assert response.status_code == 422
