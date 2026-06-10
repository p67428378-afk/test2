from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_bill_success():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": 100.0,
            "tip_percentage": 15.0,
            "number_of_people": 2
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["tip_amount"] == 15.0
    assert data["total_bill"] == 115.0
    assert data["amount_per_person"] == 57.5

def test_calculate_bill_zero_values():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": 0.0,
            "tip_percentage": 0.0,
            "number_of_people": 1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["tip_amount"] == 0.0
    assert data["total_bill"] == 0.0
    assert data["amount_per_person"] == 0.0

def test_calculate_bill_invalid_bill_amount():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": -10.0,
            "tip_percentage": 15.0,
            "number_of_people": 2
        }
    )
    assert response.status_code == 422

def test_calculate_bill_invalid_tip_percentage():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": 100.0,
            "tip_percentage": -5.0,
            "number_of_people": 2
        }
    )
    assert response.status_code == 422

def test_calculate_bill_invalid_number_of_people():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": 100.0,
            "tip_percentage": 15.0,
            "number_of_people": 0
        }
    )
    assert response.status_code == 422

def test_calculate_bill_missing_fields():
    response = client.post(
        "/api/v1/calculate",
        json={
            "bill_amount": 100.0
        }
    )
    assert response.status_code == 422
