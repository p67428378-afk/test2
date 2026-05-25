from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.policy import PolicyHolder

def test_create_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder = PolicyHolder(name="testuser", email="test@example.com", phone_number="1234567890", address="123 test street", hashed_password="testpassword")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    response = client.post(
        "/api/v1/policies/",
        json={"policy_number": "POL-001", "coverage_type": "basic", "premium_amount": 100.0, "status": "active", "effective_date": "2024-01-01", "expiration_date": "2024-12-31", "policy_holder_id": policy_holder.id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL-001"
    assert data["coverage_type"] == "basic"
    assert data["premium_amount"] == 100.0
    assert data["status"] == "active"


def test_read_policies(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder = PolicyHolder(name="testuser", email="test@example.com", phone_number="1234567890", address="123 test street", hashed_password="testpassword")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    client.post(
        "/api/v1/policies/",
        json={"policy_number": "POL-001", "coverage_type": "basic", "premium_amount": 100.0, "status": "active", "effective_date": "2024-01-01", "expiration_date": "2024-12-31", "policy_holder_id": policy_holder.id}
    )
    response = client.get("/api/v1/policies/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["policy_number"] == "POL-001"

def test_read_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder = PolicyHolder(name="testuser", email="test@example.com", phone_number="1234567890", address="123 test street", hashed_password="testpassword")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    response = client.post(
        "/api/v1/policies/",
        json={"policy_number": "POL-001", "coverage_type": "basic", "premium_amount": 100.0, "status": "active", "effective_date": "2024-01-01", "expiration_date": "2024-12-31", "policy_holder_id": policy_holder.id}
    )
    policy_id = response.json()["id"]

    response = client.get(f"/api/v1/policies/{policy_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL-001"

def test_update_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder = PolicyHolder(name="testuser", email="test@example.com", phone_number="1234567890", address="123 test street", hashed_password="testpassword")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    response = client.post(
        "/api/v1/policies/",
        json={"policy_number": "POL-001", "coverage_type": "basic", "premium_amount": 100.0, "status": "active", "effective_date": "2024-01-01", "expiration_date": "2024-12-31", "policy_holder_id": policy_holder.id}
    )
    policy_id = response.json()["id"]

    response = client.put(
        f"/api/v1/policies/{policy_id}",
        json={"coverage_type": "premium"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["coverage_type"] == "premium"

def test_delete_policy(client: TestClient, db_session: Session):
    # Create a policy holder first
    policy_holder = PolicyHolder(name="testuser", email="test@example.com", phone_number="1234567890", address="123 test street", hashed_password="testpassword")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    response = client.post(
        "/api/v1/policies/",
        json={"policy_number": "POL-001", "coverage_type": "basic", "premium_amount": 100.0, "status": "active", "effective_date": "2024-01-01", "expiration_date": "2024-12-31", "policy_holder_id": policy_holder.id}
    )
    policy_id = response.json()["id"]

    response = client.delete(f"/api/v1/policies/{policy_id}")
    assert response.status_code == 200

    response = client.get(f"/api/v1/policies/{policy_id}")
    assert response.status_code == 404
