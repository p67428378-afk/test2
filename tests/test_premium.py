
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas import PremiumCalculationRequest

client = TestClient(app)

def test_calculate_premium_endpoint():
    request_data = {
        "driver_age": 30,
        "ncb_years": 2,
        "vehicle_make": "Toyota",
        "vehicle_model": "Camry",
        "vehicle_year": 2020,
        "vehicle_risk_factor": 1.0
    }
    response = client.post("/api/v1/insurance/premium/calculate", json=request_data)
    assert response.status_code == 200
    assert "calculated_premium" in response.json()
    assert response.json()["calculated_premium"] == 400.0

def test_calculate_premium_ncb_cap():
    request_data = {
        "driver_age": 45,
        "ncb_years": 10,
        "vehicle_make": "Honda",
        "vehicle_model": "Civic",
        "vehicle_year": 2018,
        "vehicle_risk_factor": 1.0
    }
    response = client.post("/api/v1/insurance/premium/calculate", json=request_data)
    assert response.status_code == 200
    assert response.json()["calculated_premium"] == 250.0

def test_calculate_premium_low_risk_vehicle():
    request_data = {
        "driver_age": 50,
        "ncb_years": 5,
        "vehicle_make": "Subaru",
        "vehicle_model": "Outback",
        "vehicle_year": 2022,
        "vehicle_risk_factor": 0.7
    }
    response = client.post("/api/v1/insurance/premium/calculate", json=request_data)
    assert response.status_code == 400 # vehicle_risk_factor is out of bound

def test_calculate_premium_high_risk_vehicle():
    request_data = {
        "driver_age": 25,
        "ncb_years": 1,
        "vehicle_make": "Ford",
        "vehicle_model": "Mustang",
        "vehicle_year": 2021,
        "vehicle_risk_factor": 1.5
    }
    response = client.post("/api/v1/insurance/premium/calculate", json=request_data)
    assert response.status_code == 200
    assert response.json()["calculated_premium"] == 640.0

def test_calculate_premium_invalid_ncb():
    request_data = {
        "driver_age": 35,
        "ncb_years": -1,
        "vehicle_make": "Nissan",
        "vehicle_model": "Titan",
        "vehicle_year": 2019,
        "vehicle_risk_factor": 1.1
    }
    response = client.post("/api/v1/insurance/premium/calculate", json=request_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "NCB years cannot be negative"

