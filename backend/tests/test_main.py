
from fastapi.testclient import TestClient

def test_check_eligibility_eligible_high_score(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 800, "annual_income": 100000, "monthly_debts": 1000},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Eligible"
    assert data["interest_rate"] == 5.0

def test_check_eligibility_eligible_medium_score(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 700, "annual_income": 80000, "monthly_debts": 1500},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Eligible"
    assert data["interest_rate"] == 7.5

def test_check_eligibility_eligible_low_score(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 650, "annual_income": 60000, "monthly_debts": 1000},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Eligible"
    assert data["interest_rate"] == 7.5

def test_check_eligibility_ineligible_low_score(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 550, "annual_income": 50000, "monthly_debts": 500},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Ineligible"
    assert "Credit score is too low." in data["ineligibility_reasons"]

def test_check_eligibility_ineligible_low_income(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 650, "annual_income": 25000, "monthly_debts": 500},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Ineligible"
    assert "Annual income is too low." in data["ineligibility_reasons"]

def test_check_eligibility_ineligible_high_dti(client: TestClient):
    response = client.post(
        "/check-eligibility/",
        json={"credit_score": 700, "annual_income": 60000, "monthly_debts": 3000},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Ineligible"
    assert "Debt-to-income ratio is too high." in data["ineligibility_reasons"]
