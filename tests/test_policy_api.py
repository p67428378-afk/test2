from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db # Import get_db
from datetime import date, timedelta

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Policyholder Self-Service API"}

def test_get_policy_details(client: TestClient):
    # Create a policyholder
    db = client.app.dependency_overrides[get_db]().__next__() # Access the overridden db session
    policyholder = models.Policyholder(name="John Doe", address="123 Main St", contact_info="john@example.com", date_of_birth=date(1990, 1, 1))
    db.add(policyholder)
    db.commit()
    db.refresh(policyholder)

    # Create a policy
    policy = models.Policy(
        policy_number="POL123",
        policy_type="Gold Plan",
        effective_date=date(2024, 1, 1),
        expiration_date=date(2025, 1, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=200.00,
        policyholder_id=policyholder.id
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)

    response = client.get(f"/policy/{policy.id}")
    assert response.status_code == 200
    assert response.json()["policy_number"] == "POL123"
    assert response.json()["status"] == "Active"

def test_get_policy_details_not_found(client: TestClient):
    response = client.get("/policy/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}

def test_update_coverage_options(client: TestClient):
    db = client.app.dependency_overrides[get_db]().__next__() # Access the overridden db session
    # Create a policyholder
    policyholder = models.Policyholder(name="Jane Doe", address="456 Oak Ave", contact_info="jane@example.com", date_of_birth=date(1985, 5, 10))
    db.add(policyholder)
    db.commit()
    db.refresh(policyholder)

    # Create a policy
    policy = models.Policy(
        policy_number="POL456",
        policy_type="Silver Plan",
        effective_date=date(2023, 6, 1),
        expiration_date=date(2024, 6, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=150.00,
        policyholder_id=policyholder.id
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)

    coverage_update = {
        "coverage_type": "Dental",
        "details": "Premium Dental Plan",
        "start_date": (date.today() + timedelta(days=30)).isoformat(),
        "end_date": (date.today() + timedelta(days=365)).isoformat()
    }

    response = client.put(f"/policy/{policy.id}/coverage", json=coverage_update)
    assert response.status_code == 200
    assert response.json()["status"] == "Active"
    # Verify coverage option was added (this would require fetching policy again or checking db directly)
    updated_policy = db.query(models.Policy).filter(models.Policy.id == policy.id).first()
    assert len(updated_policy.coverage_options) == 1
    assert updated_policy.coverage_options[0].coverage_type == "Dental"

def test_update_coverage_options_invalid_date(client: TestClient):
    db = client.app.dependency_overrides[get_db]().__next__() # Access the overridden db session
    # Create a policyholder
    policyholder = models.Policyholder(name="Peter Pan", address="Neverland", contact_info="peter@example.com", date_of_birth=date(1904, 1, 1))
    db.add(policyholder)
    db.commit()
    db.refresh(policyholder)

    # Create a policy
    policy = models.Policy(
        policy_number="POL789",
        policy_type="Bronze Plan",
        effective_date=date(2024, 1, 1),
        expiration_date=date(2025, 1, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=100.00,
        policyholder_id=policyholder.id
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)

    coverage_update = {
        "coverage_type": "Vision",
        "details": "Basic Vision Plan",
        "start_date": date.today().isoformat(), # Invalid date (not after today)
        "end_date": (date.today() + timedelta(days=365)).isoformat()
    }

    response = client.put(f"/policy/{policy.id}/coverage", json=coverage_update)
    assert response.status_code == 400
    assert response.json() == {"detail": "Coverage changes can only be scheduled after today."
}

def test_cancel_policy(client: TestClient):
    db = client.app.dependency_overrides[get_db]().__next__() # Access the overridden db session
    # Create a policyholder
    policyholder = models.Policyholder(name="Alice Wonderland", address="Wonderland", contact_info="alice@example.com", date_of_birth=date(1865, 1, 1))
    db.add(policyholder)
    db.commit()
    db.refresh(policyholder)

    # Create a policy
    policy = models.Policy(
        policy_number="POL000",
        policy_type="Platinum Plan",
        effective_date=date(2024, 1, 1),
        expiration_date=date(2025, 1, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=300.00,
        policyholder_id=policyholder.id
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)

    response = client.delete(f"/policy/{policy.id}")
    assert response.status_code == 200
    assert response.json()["status"] == "Cancelled"
    # Verify policy history was added
    updated_policy = db.query(models.Policy).filter(models.Policy.id == policy.id).first()
    assert len(updated_policy.policy_history) == 1
    assert updated_policy.policy_history[0].action == "Policy Cancellation"

def test_cancel_policy_not_found(client: TestClient):
    response = client.delete("/policy/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}
