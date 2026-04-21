from fastapi.testclient import TestClient

def test_check_eligibility_eligible_high_score(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": 750, "annual_income": 100000, "monthly_debts": 1000})
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] is True
    assert data["interest_rate"] == 4.25
    assert data["ineligibility_reasons"] is None

def test_check_eligibility_eligible_medium_score(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": 680, "annual_income": 80000, "monthly_debts": 1500})
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] is True
    assert data["interest_rate"] == 5.0
    assert data["ineligibility_reasons"] is None

def test_check_eligibility_eligible_low_score(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": 620, "annual_income": 50000, "monthly_debts": 1000})
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] is True
    assert data["interest_rate"] == 6.0
    assert data["ineligibility_reasons"] is None

def test_check_eligibility_ineligible_low_score(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": 599, "annual_income": 50000, "monthly_debts": 1000})
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] is False
    assert data["interest_rate"] is None
    assert "Credit score below the minimum threshold of 600." in data["ineligibility_reasons"]

def test_check_eligibility_ineligible_high_dti(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": 700, "annual_income": 60000, "monthly_debts": 3000})
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] is False
    assert data["interest_rate"] is None
    assert "Debt-to-income ratio exceeds the maximum threshold of 40%." in data["ineligibility_reasons"]

def test_check_eligibility_invalid_input(client: TestClient):
    response = client.post("/api/v1/loan/check-eligibility", json={"credit_score": -10, "annual_income": 50000, "monthly_debts": 1000})
    assert response.status_code == 422
