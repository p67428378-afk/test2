import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from main import app
from database import Base, get_db
from models import Policy, CoverageOption, Beneficiary
from schemas import PolicyCreate, CoverageOptionCreate, BeneficiaryCreate, PolicyUpdate

# Setup a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(name="client")
def client_fixture(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

def test_create_policy(client, db_session):
    policy_data = {
        "policy_number": "POL12345",
        "policyholder_id": "PH001",
        "coverage_type": "Gold Plan",
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
        "premium_amount": 500.00,
        "coverage_options": [
            {"option_name": "Dental", "status": "Active", "cost_impact": 50.00}
        ],
        "beneficiaries": [
            {"name": "John Doe", "relationship_to_policyholder": "Self", "date_of_birth": "1990-05-15"}
        ]
    }
    response = client.post("/policies/", json=policy_data)
    assert response.status_code == 201
    data = response.json()
    assert data["policy_number"] == "POL12345"
    assert data["policyholder_id"] == "PH001"
    assert len(data["coverage_options"]) == 1
    assert len(data["beneficiaries"]) == 1
    assert data["status"] == "Active"

def test_create_policy_duplicate_policy_number(client, db_session):
    policy_data = {
        "policy_number": "POL12345",
        "policyholder_id": "PH001",
        "coverage_type": "Gold Plan",
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
        "premium_amount": 500.00,
        "coverage_options": [],
        "beneficiaries": []
    }
    client.post("/policies/", json=policy_data)
    response = client.post("/policies/", json=policy_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Policy number already registered"}

def test_read_policy(client, db_session):
    policy_data = {
        "policy_number": "POL12346",
        "policyholder_id": "PH002",
        "coverage_type": "Silver Plan",
        "effective_date": "2024-02-01",
        "expiration_date": "2024-11-30",
        "premium_amount": 300.00,
        "coverage_options": [
            {"option_name": "Vision", "status": "Active", "cost_impact": 30.00}
        ],
        "beneficiaries": [
            {"name": "Jane Doe", "relationship_to_policyholder": "Spouse", "date_of_birth": "1992-03-20"}
        ]
    }
    create_response = client.post("/policies/", json=policy_data)
    policy_id = create_response.json()["id"]

    response = client.get(f"/policies/{policy_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL12346"
    assert data["policyholder_id"] == "PH002"
    assert len(data["coverage_options"]) == 1
    assert data["coverage_options"][0]["option_name"] == "Vision"
    assert len(data["beneficiaries"]) == 1
    assert data["beneficiaries"][0]["name"] == "Jane Doe"

def test_read_policy_not_found(client, db_session):
    response = client.get("/policies/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}

def test_read_policies_by_policyholder(client, db_session):
    policy_data_1 = {
        "policy_number": "POL12347",
        "policyholder_id": "PH003",
        "coverage_type": "Bronze Plan",
        "effective_date": "2024-03-01",
        "expiration_date": "2024-10-31",
        "premium_amount": 200.00,
        "coverage_options": [],
        "beneficiaries": []
    }
    policy_data_2 = {
        "policy_number": "POL12348",
        "policyholder_id": "PH003",
        "coverage_type": "Platinum Plan",
        "effective_date": "2024-04-01",
        "expiration_date": "2025-03-31",
        "premium_amount": 700.00,
        "coverage_options": [],
        "beneficiaries": []
    }
    client.post("/policies/", json=policy_data_1)
    client.post("/policies/", json=policy_data_2)

    response = client.get("/policies/policyholder/PH003")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["policyholder_id"] == "PH003"
    assert data[1]["policyholder_id"] == "PH003"

def test_update_policy(client, db_session):
    policy_data = {
        "policy_number": "POL12349",
        "policyholder_id": "PH004",
        "coverage_type": "Basic Plan",
        "effective_date": "2024-05-01",
        "expiration_date": "2025-04-30",
        "premium_amount": 150.00,
        "coverage_options": [],
        "beneficiaries": []
    }
    create_response = client.post("/policies/", json=policy_data)
    policy_id = create_response.json()["id"]

    update_data = {
        "coverage_type": "Premium Basic Plan",
        "premium_amount": 200.00,
        "status": "Cancelled",
        "coverage_options": [
            {"option_name": "Physiotherapy", "status": "Active", "cost_impact": 75.00}
        ],
        "beneficiaries": [
            {"name": "Alice Smith", "relationship_to_policyholder": "Child", "date_of_birth": "2010-01-01"}
        ]
    }
    response = client.put(f"/policies/{policy_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["coverage_type"] == "Premium Basic Plan"
    assert data["premium_amount"] == 200.00
    assert data["status"] == "Cancelled"
    assert len(data["coverage_options"]) == 1
    assert data["coverage_options"][0]["option_name"] == "Physiotherapy"
    assert len(data["beneficiaries"]) == 1
    assert data["beneficiaries"][0]["name"] == "Alice Smith"

def test_update_policy_not_found(client, db_session):
    update_data = {"coverage_type": "New Type"}
    response = client.put("/policies/nonexistent_id", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}

def test_delete_policy(client, db_session):
    policy_data = {
        "policy_number": "POL12350",
        "policyholder_id": "PH005",
        "coverage_type": "Family Plan",
        "effective_date": "2024-06-01",
        "expiration_date": "2025-05-31",
        "premium_amount": 600.00,
        "coverage_options": [],
        "beneficiaries": []
    }
    create_response = client.post("/policies/", json=policy_data)
    policy_id = create_response.json()["id"]

    response = client.delete(f"/policies/{policy_id}")
    assert response.status_code == 204

    get_response = client.get(f"/policies/{policy_id}")
    assert get_response.status_code == 404

def test_delete_policy_not_found(client, db_session):
    response = client.delete("/policies/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}
