from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.policy import Policy

def test_calculate_premium_economy_0_years_ncb(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 0,
            "vehicle_type": "Economy"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_premium"] == 400.0  # 500 * (1 - 0) * 0.8
    assert data["ncb_discount_percentage"] == 0.0
    assert data["vehicle_multiplier"] == 0.8

def test_calculate_premium_standard_3_years_ncb(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 3,
            "vehicle_type": "Standard"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_premium"] == 400.0  # 500 * (1 - 0.20) * 1.0
    assert data["ncb_discount_percentage"] == 0.2
    assert data["vehicle_multiplier"] == 1.0

def test_calculate_premium_sport_5_years_ncb(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 5,
            "vehicle_type": "Sport"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_premium"] == 390.0  # 500 * (1 - 0.35) * 1.2
    assert data["ncb_discount_percentage"] == 0.35
    assert data["vehicle_multiplier"] == 1.2

def test_calculate_premium_luxury_7_years_ncb_capped(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 7,
            "vehicle_type": "Luxury"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_premium"] == 400.0  # 500 * (1 - 0.50) * 1.6 = 400
    assert data["ncb_discount_percentage"] == 0.5
    assert data["vehicle_multiplier"] == 1.6

def test_calculate_premium_invalid_vehicle_type(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 2,
            "vehicle_type": "Motorcycle"
        }
    )
    assert response.status_code == 422  # Unprocessable Entity for invalid enum

def test_calculate_premium_negative_base_rate(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": -100,
            "no_claims_years": 2,
            "vehicle_type": "Standard"
        }
    )
    assert response.status_code == 422  # Unprocessable Entity for validation error

def test_calculate_premium_out_of_range_ncb(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/premium/calculate",
        json={
            "base_rate": 500,
            "no_claims_years": 11,
            "vehicle_type": "Standard"
        }
    )
    assert response.status_code == 422  # Unprocessable Entity for validation error
