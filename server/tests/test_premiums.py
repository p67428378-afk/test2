
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_premium():
    response = client.post("/api/v1/premiums/calculate", json={"ncb_percentage": 0.30, "vehicle_multiplier": 1.2})
    assert response.status_code == 200
    assert response.json() == {"calculated_premium": 420.0}

def test_calculate_premium_min_values():
    response = client.post("/api/v1/premiums/calculate", json={"ncb_percentage": 0.10, "vehicle_multiplier": 0.7})
    assert response.status_code == 200
    assert response.json() == {"calculated_premium": 320.0} # (500 * 0.8) * (1 - 0.2) = 320

def test_calculate_premium_max_values():
    response = client.post("/api/v1/premiums/calculate", json={"ncb_percentage": 0.60, "vehicle_multiplier": 1.8})
    assert response.status_code == 200
    assert response.json() == {"calculated_premium": 400.0} # (500 * 1.6) * (1 - 0.5) = 400
