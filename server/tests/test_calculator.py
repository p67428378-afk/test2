import pytest
from server.schemas.calculator import TipCalculationRequest
from server.services.calculator_service import calculate_tip


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_calculate_tip_service_standard():
    req = TipCalculationRequest(bill_amount=100.0, tip_percentage=15.0, num_people=2)
    res = calculate_tip(req)
    assert res.total_tip == 15.0
    assert res.total_bill == 115.0
    assert res.tip_per_person == 7.5
    assert res.total_per_person == 57.5


def test_calculate_tip_service_presets():
    # Test 10%
    res10 = calculate_tip(TipCalculationRequest(bill_amount=120.0, tip_percentage=10.0, num_people=2))
    assert res10.total_tip == 12.0
    assert res10.total_bill == 132.0
    assert res10.tip_per_person == 6.0
    assert res10.total_per_person == 66.0

    # Test 15% (example from HLD: $120, 15%, 2 people)
    res15 = calculate_tip(TipCalculationRequest(bill_amount=120.0, tip_percentage=15.0, num_people=2))
    assert res15.total_tip == 18.0
    assert res15.total_bill == 138.0
    assert res15.tip_per_person == 9.0
    assert res15.total_per_person == 69.0

    # Test 18%
    res18 = calculate_tip(TipCalculationRequest(bill_amount=100.0, tip_percentage=18.0, num_people=1))
    assert res18.total_tip == 18.0
    assert res18.total_bill == 118.0
    assert res18.tip_per_person == 18.0
    assert res18.total_per_person == 118.0

    # Test 20%
    res20 = calculate_tip(TipCalculationRequest(bill_amount=100.0, tip_percentage=20.0, num_people=4))
    assert res20.total_tip == 20.0
    assert res20.total_bill == 120.0
    assert res20.tip_per_person == 5.0
    assert res20.total_per_person == 30.0


def test_calculate_tip_service_custom_percentages():
    # 0% tip
    res0 = calculate_tip(TipCalculationRequest(bill_amount=50.0, tip_percentage=0.0, num_people=1))
    assert res0.total_tip == 0.0
    assert res0.total_bill == 50.0
    assert res0.tip_per_person == 0.0
    assert res0.total_per_person == 50.0

    # 100% tip
    res100 = calculate_tip(TipCalculationRequest(bill_amount=50.0, tip_percentage=100.0, num_people=2))
    assert res100.total_tip == 50.0
    assert res100.total_bill == 100.0
    assert res100.tip_per_person == 25.0
    assert res100.total_per_person == 50.0

    # Fractional tip percentage (e.g. 12.5%)
    res_frac = calculate_tip(TipCalculationRequest(bill_amount=80.0, tip_percentage=12.5, num_people=2))
    assert res_frac.total_tip == 10.0
    assert res_frac.total_bill == 90.0
    assert res_frac.tip_per_person == 5.0
    assert res_frac.total_per_person == 45.0


def test_calculate_tip_endpoint_success_default_people(client):
    payload = {
        "bill_amount": 100.0,
        "tip_percentage": 15.0
    }
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 15.0
    assert data["total_bill"] == 115.0
    assert data["tip_per_person"] == 15.0
    assert data["total_per_person"] == 115.0


def test_calculate_tip_endpoint_success_split(client):
    payload = {
        "bill_amount": 120.0,
        "tip_percentage": 15.0,
        "num_people": 2
    }
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 18.0
    assert data["total_bill"] == 138.0
    assert data["tip_per_person"] == 9.0
    assert data["total_per_person"] == 69.0


def test_calculate_tip_endpoint_rounding_precision(client):
    # $33.33 bill, 15% tip, 3 people
    # total_tip = 33.33 * 0.15 = 4.9995 -> 5.00
    # total_bill = 33.33 + 5.00 = 38.33
    # tip_per_person = 5.00 / 3 = 1.6666... -> 1.67
    # total_per_person = 38.33 / 3 = 12.7766... -> 12.78
    payload = {
        "bill_amount": 33.33,
        "tip_percentage": 15.0,
        "num_people": 3
    }
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 5.00
    assert data["total_bill"] == 38.33
    assert data["tip_per_person"] == 1.67
    assert data["total_per_person"] == 12.78


def test_calculate_tip_endpoint_validation_errors(client):
    # Negative bill amount
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": -10.0, "tip_percentage": 15.0, "num_people": 1})
    assert res.status_code == 422

    # Zero bill amount
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": 0.0, "tip_percentage": 15.0, "num_people": 1})
    assert res.status_code == 422

    # Negative tip percentage
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": 100.0, "tip_percentage": -5.0, "num_people": 1})
    assert res.status_code == 422

    # Tip percentage > 100
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": 100.0, "tip_percentage": 105.0, "num_people": 1})
    assert res.status_code == 422

    # num_people < 1
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": 100.0, "tip_percentage": 15.0, "num_people": 0})
    assert res.status_code == 422

    # Missing required bill_amount
    res = client.post("/api/v1/calculate-tip", json={"tip_percentage": 15.0, "num_people": 1})
    assert res.status_code == 422

    # Missing required tip_percentage
    res = client.post("/api/v1/calculate-tip", json={"bill_amount": 100.0, "num_people": 1})
    assert res.status_code == 422
