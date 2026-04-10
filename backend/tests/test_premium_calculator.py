from fastapi.testclient import TestClient
import pytest
from app.schemas.policy import PremiumCalculationRequest
from app.services.premium_calculator_service import get_ncb_discount, calculate_premium

def test_calculate_premium_success(client: TestClient):
    request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=3, vehicleMultiplier=1.2)
    response = client.post("/api/calculate-premium", json=request_data.dict())
    assert response.status_code == 200
    assert response.json() == {"premium": 390.0}

def test_calculate_premium_edge_case_max_ncb(client: TestClient):
    request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=10, vehicleMultiplier=1.0)
    response = client.post("/api/calculate-premium", json=request_data.dict())
    assert response.status_code == 200
    assert response.json() == {"premium": 250.0} # 50% discount

def test_calculate_premium_edge_case_min_multiplier(client: TestClient):
    request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=0, vehicleMultiplier=0.8)
    response = client.post("/api/calculate-premium", json=request_data.dict())
    assert response.status_code == 200
    assert response.json() == {"premium": 400.0}

def test_calculate_premium_edge_case_max_multiplier(client: TestClient):
    request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=0, vehicleMultiplier=1.6)
    response = client.post("/api/calculate-premium", json=request_data.dict())
    assert response.status_code == 200
    assert response.json() == {"premium": 800.0}

def test_calculate_premium_invalid_multiplier_too_low(client: TestClient):
    request_data = {"baseRate": 500, "claimFreeYears": 3, "vehicleMultiplier": 0.7}
    response = client.post("/api/calculate-premium", json=request_data)
    assert response.status_code == 422

def test_calculate_premium_invalid_multiplier_too_high(client: TestClient):
    request_data = {"baseRate": 500, "claimFreeYears": 3, "vehicleMultiplier": 1.7}
    response = client.post("/api/calculate-premium", json=request_data)
    assert response.status_code == 422

def test_calculate_premium_negative_claim_free_years(client: TestClient):
    request_data = {"baseRate": 500, "claimFreeYears": -1, "vehicleMultiplier": 1.2}
    response = client.post("/api/calculate-premium", json=request_data)
    assert response.status_code == 422

def test_calculate_premium_zero_base_rate(client: TestClient):
    request_data = PremiumCalculationRequest(baseRate=0, claimFreeYears=3, vehicleMultiplier=1.2)
    response = client.post("/api/calculate-premium", json=request_data.dict())
    assert response.status_code == 200
    assert response.json() == {"premium": 0.0}


# Tests for get_ncb_discount function
@pytest.mark.parametrize("years, expected_discount", [
    (0, 0.0),
    (1, 0.20),
    (2, 0.25),
    (3, 0.35),
    (4, 0.45),
    (5, 0.50),
    (10, 0.50),
])
def test_get_ncb_discount(years, expected_discount):
    assert get_ncb_discount(years) == expected_discount

# Tests for calculate_premium service function
def test_calculate_premium_service_invalid_multiplier():
    with pytest.raises(ValueError, match="Vehicle multiplier must be between 0.8 and 1.6"):
        request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=3, vehicleMultiplier=0.7)
        calculate_premium(request_data)

def test_calculate_premium_service_negative_years():
    with pytest.raises(ValueError, match="Claim free years cannot be negative"):
        request_data = PremiumCalculationRequest(baseRate=500, claimFreeYears=-1, vehicleMultiplier=1.2)
        calculate_premium(request_data)

def test_calculate_premium_endpoint_value_error(client: TestClient, monkeypatch):
    def mock_calculate_premium(*args, **kwargs):
        raise ValueError("A test error")
    monkeypatch.setattr("app.services.premium_calculator_service.calculate_premium", mock_calculate_premium)
    request_data = {"baseRate": 500, "claimFreeYears": 3, "vehicleMultiplier": 1.2}
    response = client.post("/api/calculate-premium", json=request_data)
    assert response.status_code == 422
    assert response.json() == {"detail": "A test error"}
