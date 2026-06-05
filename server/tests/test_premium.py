
import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.schemas import VehicleType

client = TestClient(app)

def test_calculate_premium_sedan_0_ncb():
    response = client.post("/api/v1/insurance/premium/calculate", json={
        "vehicle_value": 25000,
        "ncb_years": 0,
        "vehicle_type": "Sedan"
    })
    assert response.status_code == 200
    data = response.json()
    assert "calculated_premium" in data
    # Expected: (500 * 1.0) + (25000 * 0.01) * (1 - 20/100) = 500 + 250 * 0.8 = 500 + 200 = 700
    assert data["calculated_premium"] == pytest.approx(700.0)

def test_calculate_premium_suv_5_ncb():
    response = client.post("/api/v1/insurance/premium/calculate", json={
        "vehicle_value": 40000,
        "ncb_years": 5,
        "vehicle_type": "SUV"
    })
    assert response.status_code == 200
    data = response.json()
    assert "calculated_premium" in data
    # Expected: (500 * 1.6) + (40000 * 0.01) * (1 - 50/100) = 800 + 400 * 0.5 = 800 + 200 = 1000
    assert data["calculated_premium"] == pytest.approx(1000.0)

def test_calculate_premium_hatchback_2_ncb():
    response = client.post("/api/v1/insurance/premium/calculate", json={
        "vehicle_value": 15000,
        "ncb_years": 2,
        "vehicle_type": "Hatchback"
    })
    assert response.status_code == 200
    data = response.json()
    assert "calculated_premium" in data
    # Expected: (500 * 0.8) + (15000 * 0.01) * (1 - 30/100) = 400 + 150 * 0.7 = 400 + 105 = 505
    assert data["calculated_premium"] == pytest.approx(505.0)

def test_invalid_vehicle_type():
    response = client.post("/api/v1/insurance/premium/calculate", json={
        "vehicle_value": 20000,
        "ncb_years": 1,
        "vehicle_type": "Motorbike"
    })
    assert response.status_code == 422
