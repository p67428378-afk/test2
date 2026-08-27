from fastapi.testclient import TestClient
from server.schemas.calculator import TipCalculationRequest
from server.services.calculator_service import calculate_tip


def test_calculate_tip_service_unit():
    """Unit test for calculator_service math and rounding."""
    req = TipCalculationRequest(bill_amount=100.0, tip_percentage=15.0, num_people=2)
    resp = calculate_tip(req)
    assert resp.total_tip == 15.0
    assert resp.total_bill == 115.0
    assert resp.tip_per_person == 7.5
    assert resp.total_per_person == 57.5


def test_calculate_tip_hld_example(client: TestClient):
    """Test standard HLD example calculation: $120.00 bill, 15% tip, 2 people."""
    payload = {"bill_amount": 120.00, "tip_percentage": 15.0, "num_people": 2}
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 18.00
    assert data["total_bill"] == 138.00
    assert data["tip_per_person"] == 9.00
    assert data["total_per_person"] == 69.00


def test_calculate_tip_preset_percentages(client: TestClient):
    """Test standard preset tip percentages: 10%, 15%, 18%, 20%."""
    presets = [
        (10.0, 10.0, 110.0, 10.0, 110.0),
        (15.0, 15.0, 115.0, 15.0, 115.0),
        (18.0, 18.0, 118.0, 18.0, 118.0),
        (20.0, 20.0, 120.0, 20.0, 120.0),
    ]
    for (
        tip_pct,
        expected_tip,
        expected_bill,
        expected_tip_pp,
        expected_bill_pp,
    ) in presets:
        response = client.post(
            "/api/v1/calculate-tip",
            json={"bill_amount": 100.00, "tip_percentage": tip_pct, "num_people": 1},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_tip"] == expected_tip
        assert data["total_bill"] == expected_bill
        assert data["tip_per_person"] == expected_tip_pp
        assert data["total_per_person"] == expected_bill_pp


def test_calculate_tip_custom_percentage_bounds(client: TestClient):
    """Test custom tip percentages at boundary values: 0% and 100%."""
    # 0% tip
    res_zero = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.00, "tip_percentage": 0.0, "num_people": 1},
    )
    assert res_zero.status_code == 200
    assert res_zero.json()["total_tip"] == 0.00
    assert res_zero.json()["total_bill"] == 50.00
    assert res_zero.json()["tip_per_person"] == 0.00
    assert res_zero.json()["total_per_person"] == 50.00

    # 100% tip
    res_hundred = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.00, "tip_percentage": 100.0, "num_people": 2},
    )
    assert res_hundred.status_code == 200
    assert res_hundred.json()["total_tip"] == 50.00
    assert res_hundred.json()["total_bill"] == 100.00
    assert res_hundred.json()["tip_per_person"] == 25.00
    assert res_hundred.json()["total_per_person"] == 50.00


def test_calculate_tip_default_num_people(client: TestClient):
    """Test default num_people parameter defaults to 1."""
    payload = {"bill_amount": 80.00, "tip_percentage": 20.0}
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 16.00
    assert data["total_bill"] == 96.00
    assert data["tip_per_person"] == 16.00
    assert data["total_per_person"] == 96.00


def test_calculate_tip_rounding_precision(client: TestClient):
    """Test fractional division with strict currency rounding."""
    payload = {"bill_amount": 33.33, "tip_percentage": 18.5, "num_people": 3}
    # total_tip = round(33.33 * 0.185, 2) = round(6.16605, 2) = 6.17
    # total_bill = round(33.33 + 6.17, 2) = 39.50
    # tip_per_person = round(6.17 / 3, 2) = round(2.05666..., 2) = 2.06
    # total_per_person = round(39.50 / 3, 2) = round(13.1666..., 2) = 13.17
    response = client.post("/api/v1/calculate-tip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tip"] == 6.17
    assert data["total_bill"] == 39.50
    assert data["tip_per_person"] == 2.06
    assert data["total_per_person"] == 13.17


def test_validation_negative_or_zero_bill_amount(client: TestClient):
    """Validation test: bill amount must be greater than 0."""
    res_negative = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": -10.0, "tip_percentage": 15.0, "num_people": 1},
    )
    assert res_negative.status_code == 422

    res_zero = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 0.0, "tip_percentage": 15.0, "num_people": 1},
    )
    assert res_zero.status_code == 422


def test_validation_tip_percentage_bounds(client: TestClient):
    """Validation test: tip percentage must be between 0 and 100."""
    res_neg_tip = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.0, "tip_percentage": -1.0, "num_people": 1},
    )
    assert res_neg_tip.status_code == 422

    res_over_tip = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.0, "tip_percentage": 105.0, "num_people": 1},
    )
    assert res_over_tip.status_code == 422


def test_validation_invalid_num_people(client: TestClient):
    """Validation test: num_people must be >= 1."""
    res_zero_people = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.0, "tip_percentage": 15.0, "num_people": 0},
    )
    assert res_zero_people.status_code == 422

    res_neg_people = client.post(
        "/api/v1/calculate-tip",
        json={"bill_amount": 50.0, "tip_percentage": 15.0, "num_people": -3},
    )
    assert res_neg_people.status_code == 422


def test_validation_missing_fields(client: TestClient):
    """Validation test: missing required fields return 422."""
    res_missing_bill = client.post(
        "/api/v1/calculate-tip", json={"tip_percentage": 15.0}
    )
    assert res_missing_bill.status_code == 422

    res_missing_tip = client.post("/api/v1/calculate-tip", json={"bill_amount": 50.0})
    assert res_missing_tip.status_code == 422
