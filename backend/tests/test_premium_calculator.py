from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models
from backend import schemas

# Test Scenario 1: Calculate Premium with Base Rate and NCB
def test_calculate_premium_ncb_tier1(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "Tier 1",
            "vehicleMultiplier": 1.0
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 400.0  # 500 * (1 - 0.20)

def test_calculate_premium_ncb_tier5(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "Tier 5",
            "vehicleMultiplier": 1.0
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 250.0  # 500 * (1 - 0.50)

def test_calculate_premium_ncb_zero(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 1.0
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 500.0  # 500 * (1 - 0.0)

def test_calculate_premium_ncb_capped(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "Tier 100", # Should be capped at 50%
            "vehicleMultiplier": 1.0
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 250.0  # 500 * (1 - 0.50)

# Test Scenario 2: Apply Vehicle Multipliers
def test_calculate_premium_multiplier_0_8x(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 0.8
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 400.0  # 500 * 0.8

def test_calculate_premium_multiplier_1_6x(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 1.6
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 800.0  # 500 * 1.6

def test_calculate_premium_multiplier_combined(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "Tier 1", # 20% discount -> 400
            "vehicleMultiplier": 1.2
        }
    )
    assert response.status_code == 200
    assert response.json()["premium"] == 480.0  # 400 * 1.2

# Test Scenario 3: API Endpoint for Premium Calculation (Input Validation)
def test_calculate_premium_invalid_base_rate(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 0,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 1.0
        }
    )
    assert response.status_code == 422 # Unprocessable Entity

def test_calculate_premium_invalid_multiplier_low(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 0.7
        }
    )
    assert response.status_code == 422

def test_calculate_premium_invalid_multiplier_high(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "No NCB",
            "vehicleMultiplier": 1.7
        }
    )
    assert response.status_code == 422

# Test Scenario 4: Policy Model Definition and Storage
def test_policy_creation_and_retrieval(client: TestClient, session: Session):
    # First, calculate premium to trigger policy creation
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={
            "baseRate": 500,
            "ncbTier": "Tier 1",
            "vehicleMultiplier": 1.2,
            "vehicleDetails": {"make": "Toyota", "model": "Camry", "year": 2020},
            "customerDetails": {"name": "John Doe", "email": "john.doe@example.com"}
        }
    )
    assert response.status_code == 200
    premium_data = response.json()
    assert "premium" in premium_data
    assert "policyId" in premium_data # Assuming policyId is returned in the response

    policy_id = premium_data["policyId"]

    # Retrieve the policy from the database directly to verify storage
    policy = session.query(models.Policy).filter(models.Policy.policyId == policy_id).first()
    assert policy is not None
    assert policy.baseRate == 500.0
    assert policy.ncbTier == "Tier 1"
    assert policy.ncbDiscountPercentage == 0.20
    assert policy.vehicleMultiplier == 1.2
    assert policy.finalPremium == 480.0
    assert policy.vehicleDetails == {"make": "Toyota", "model": "Camry", "year": 2020}
    assert policy.customerDetails == {"name": "John Doe", "email": "john.doe@example.com"}

