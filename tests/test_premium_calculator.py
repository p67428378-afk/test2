import pytest
from fastapi.testclient import TestClient

def test_calculate_premium_base_case(test_client: TestClient):
    """Test premium calculation with a standard NCB and vehicle multiplier."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.3,
        "vehicle_multiplier": 1.2
    })
    assert response.status_code == 200
    assert response.json()["calculated_premium"] == 420.0

def test_calculate_premium_with_max_ncb(test_client: TestClient):
    """Test premium calculation with NCB at the 50% cap."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.6,  # Above the 50% cap
        "vehicle_multiplier": 1.0
    })
    assert response.status_code == 200
    # NCB is capped at 0.5, so discount is 500 * 0.5 = 250. Premium = 500 - 250 = 250.
    assert response.json()["calculated_premium"] == 250.0

def test_calculate_premium_with_zero_ncb(test_client: TestClient):
    """Test premium calculation with zero NCB."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.0,
        "vehicle_multiplier": 1.0
    })
    assert response.status_code == 200
    assert response.json()["calculated_premium"] == 500.0

def test_calculate_premium_with_low_vehicle_multiplier(test_client: TestClient):
    """Test premium calculation with a vehicle multiplier less than 1."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.2,
        "vehicle_multiplier": 0.8
    })
    assert response.status_code == 200
    # Premium after NCB = 500 * (1 - 0.2) = 400. Final premium = 400 * 0.8 = 320.
    assert response.json()["calculated_premium"] == 320.0

def test_calculate_premium_with_high_vehicle_multiplier(test_client: TestClient):
    """Test premium calculation with a vehicle multiplier greater than 1."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.2,
        "vehicle_multiplier": 1.6
    })
    assert response.status_code == 200
    # Premium after NCB = 500 * (1 - 0.2) = 400. Final premium = 400 * 1.6 = 640.
    assert response.json()["calculated_premium"] == 640.0

def test_invalid_input_negative_ncb(test_client: TestClient):
    """Test API with invalid negative NCB."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": -0.1,
        "vehicle_multiplier": 1.0
    })
    assert response.status_code == 422  # Unprocessable Entity for validation error

def test_invalid_input_negative_multiplier(test_client: TestClient):
    """Test API with invalid negative vehicle multiplier."""
    response = test_client.post("/api/v1/insurance/premium", json={
        "base_rate": 500,
        "ncb": 0.1,
        "vehicle_multiplier": -1.2
    })
    assert response.status_code == 422  # Unprocessable Entity for validation error
