from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.app.main import app
from backend.app import models, schemas
from datetime import date
import pytest

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Health Insurance Policy Management API"}

def test_create_policy_holder(client: TestClient, db_session: Session):
    policy_holder_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_number": "123-456-7890",
        "address": "123 Main St"
    }
    response = client.post("/api/v1/policy_holders/", json=policy_holder_data)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert "user_id" in data

def test_get_policy_holder(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder_data = {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone_number": "098-765-4321",
        "address": "456 Oak Ave"
    }
    response = client.post("/api/v1/policy_holders/", json=policy_holder_data)
    policy_holder_id = response.json()["user_id"]

    response = client.get(f"/api/v1/policy_holders/{policy_holder_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Jane"
    assert data["email"] == "jane.smith@example.com"

def test_create_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder_data = {
        "first_name": "Alice",
        "last_name": "Brown",
        "email": "alice.brown@example.com",
        "phone_number": "111-222-3333",
        "address": "789 Pine Rd"
    }
    response = client.post("/api/v1/policy_holders/", json=policy_holder_data)
    policy_holder_id = response.json()["user_id"]

    policy_data = {
        "policy_number": "POL-001",
        "plan_type": "Gold",
        "deductible": 1000.0,
        "co_pay": 0.1,
        "premium_amount": 200.0,
        "effective_date": "2023-01-01",
        "expiration_date": "2023-12-31",
        "status": "Active",
    }
    response = client.post(f"/api/v1/policy_holders/{policy_holder_id}/policies/", json=policy_data)
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL-001"
    assert data["user_id"] == policy_holder_id

def test_get_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder_data = {
        "first_name": "Bob",
        "last_name": "White",
        "email": "bob.white@example.com",
        "phone_number": "444-555-6666",
        "address": "321 Elm St"
    }
    response = client.post("/api/v1/policy_holders/", json=policy_holder_data)
    policy_holder_id = response.json()["user_id"]

    # Create a policy
    policy_data = {
        "policy_number": "POL-002",
        "plan_type": "Silver",
        "deductible": 2000.0,
        "co_pay": 0.2,
        "premium_amount": 150.0,
        "effective_date": "2023-02-01",
        "expiration_date": "2024-01-31",
        "status": "Active",
    }
    response = client.post(f"/api/v1/policy_holders/{policy_holder_id}/policies/", json=policy_data)
    policy_id = response.json()["policy_id"]

    response = client.get(f"/api/v1/policies/{policy_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL-002"
    assert data["policy_id"] == policy_id

def test_get_policy_holder_policies(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder_data = {
        "first_name": "Charlie",
        "last_name": "Green",
        "email": "charlie.green@example.com",
        "phone_number": "777-888-9999",
        "address": "654 Birch Ln"
    }
    response = client.post("/api/v1/policy_holders/", json=policy_holder_data)
    policy_holder_id = response.json()["user_id"]

    # Create two policies for this policy holder
    policy_data_1 = {
        "policy_number": "POL-003",
        "plan_type": "Bronze",
        "deductible": 3000.0,
        "co_pay": 0.3,
        "premium_amount": 100.0,
        "effective_date": "2023-03-01",
        "expiration_date": "2024-02-28",
        "status": "Active",
    }
    client.post(f"/api/v1/policy_holders/{policy_holder_id}/policies/", json=policy_data_1)

    policy_data_2 = {
        "policy_number": "POL-004",
        "plan_type": "Platinum",
        "deductible": 500.0,
        "co_pay": 0.05,
        "premium_amount": 300.0,
        "effective_date": "2023-04-01",
        "expiration_date": "2024-03-31",
        "status": "Active",
    }
    client.post(f"/api/v1/policy_holders/{policy_holder_id}/policies/", json=policy_data_2)

    response = client.get(f"/api/v1/policy_holders/{policy_holder_id}/policies/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["policy_number"] == "POL-003"
    assert data[1]["policy_number"] == "POL-004"
