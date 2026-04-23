from fastapi.testclient import TestClient
from app.main import app
from app.schemas.applicant import ApplicantCreate

client = TestClient(app)

def test_create_application_success():
    application_data = {
        "full_name": "John Doe",
        "ssn": "123-45-6789",
        "date_of_birth": "1990-01-01",
        "address": "123 Main St",
        "annual_income": 75000.0,
        "employment_status": "Employed",
        "credit_score": 720
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Approved"
    assert data["credit_limit"] == 5000.0

def test_create_application_invalid_ssn():
    application_data = {
        "full_name": "Jane Doe",
        "ssn": "123456789",
        "date_of_birth": "1985-05-10",
        "address": "456 Oak Ave",
        "annual_income": 60000.0,
        "employment_status": "Employed",
        "credit_score": 680
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 422

def test_create_application_missing_fields():
    application_data = {
        "full_name": "Sam Smith",
        "ssn": "987-65-4321",
        "credit_score": 700
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 422

def test_decision_rejected():
    application_data = {
        "full_name": "Tom Thumb",
        "ssn": "111-22-3333",
        "date_of_birth": "2000-02-02",
        "address": "789 Pine Ln",
        "annual_income": 40000.0,
        "employment_status": "Unemployed",
        "credit_score": 550
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Rejected"
    assert data["credit_limit"] is None

def test_decision_referred():
    application_data = {
        "full_name": "Mary Major",
        "ssn": "444-55-6666",
        "date_of_birth": "1995-03-03",
        "address": "101 Maple Dr",
        "annual_income": 45000.0,
        "employment_status": "Employed",
        "credit_score": 650
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Referred"
    assert data["credit_limit"] is None

def test_credit_limit_tier_1():
    application_data = {
        "full_name": "Peter Piper",
        "ssn": "777-88-9999",
        "date_of_birth": "1980-04-04",
        "address": "212 Birch Rd",
        "annual_income": 120000.0,
        "employment_status": "Employed",
        "credit_score": 780
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Approved"
    assert data["credit_limit"] == 10000.0

def test_credit_limit_tier_2():
    application_data = {
        "full_name": "Wendy Witness",
        "ssn": "121-23-2345",
        "date_of_birth": "1988-08-08",
        "address": "343 Cedar Ct",
        "annual_income": 80000.0,
        "employment_status": "Employed",
        "credit_score": 730
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Approved"
    assert data["credit_limit"] == 5000.0

def test_credit_limit_tier_3():
    application_data = {
        "full_name": "Chris Claimant",
        "ssn": "565-67-6789",
        "date_of_birth": "1992-09-09",
        "address": "454 Spruce St",
        "annual_income": 60000.0,
        "employment_status": "Employed",
        "credit_score": 700
    }
    response = client.post("/api/v1/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Approved"
    assert data["credit_limit"] == 2500.0
