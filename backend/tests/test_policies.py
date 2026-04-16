from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models.policy import Policy, PolicyHolder

def test_create_policy(client: TestClient, db_session: Session):
    # Create a policy holder
    policy_holder_data = {"email": "test@example.com", "password": "password"}
    response = client.post("/policy-holders/", json=policy_holder_data)
    assert response.status_code == 200
    policy_holder = response.json()
    assert policy_holder["email"] == policy_holder_data["email"]

    # Create a policy
    policy_data = {
        "policy_number": "POL-123",
        "coverage_type": "Health",
        "premium_amount": 100.0,
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
    }
    response = client.post(f"/policy-holders/{policy_holder['id']}/policies/", json=policy_data)
    assert response.status_code == 200
    policy = response.json()
    assert policy["policy_number"] == policy_data["policy_number"]

def test_get_policy(client: TestClient, db_session: Session):
    # Create a policy holder and a policy
    policy_holder_data = {"email": "test@example.com", "password": "password"}
    response = client.post("/policy-holders/", json=policy_holder_data)
    policy_holder = response.json()
    policy_data = {
        "policy_number": "POL-123",
        "coverage_type": "Health",
        "premium_amount": 100.0,
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
    }
    response = client.post(f"/policy-holders/{policy_holder['id']}/policies/", json=policy_data)
    policy = response.json()

    # Get the policy
    response = client.get(f"/policies/{policy['id']}")
    assert response.status_code == 200
    retrieved_policy = response.json()
    assert retrieved_policy["policy_number"] == policy_data["policy_number"]

def test_update_policy(client: TestClient, db_session: Session):
    # Create a policy holder and a policy
    policy_holder_data = {"email": "test@example.com", "password": "password"}
    response = client.post("/policy-holders/", json=policy_holder_data)
    policy_holder = response.json()
    policy_data = {
        "policy_number": "POL-123",
        "coverage_type": "Health",
        "premium_amount": 100.0,
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
    }
    response = client.post(f"/policy-holders/{policy_holder['id']}/policies/", json=policy_data)
    policy = response.json()

    # Update the policy
    update_data = {"premium_amount": 120.0}
    response = client.put(f"/policies/{policy['id']}", json=update_data)
    assert response.status_code == 200
    updated_policy = response.json()
    assert updated_policy["premium_amount"] == 120.0

def test_delete_policy(client: TestClient, db_session: Session):
    # Create a policy holder and a policy
    policy_holder_data = {"email": "test@example.com", "password": "password"}
    response = client.post("/policy-holders/", json=policy_holder_data)
    policy_holder = response.json()
    policy_data = {
        "policy_number": "POL-123",
        "coverage_type": "Health",
        "premium_amount": 100.0,
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
    }
    response = client.post(f"/policy-holders/{policy_holder['id']}/policies/", json=policy_data)
    policy = response.json()

    # Delete the policy
    response = client.delete(f"/policies/{policy['id']}")
    assert response.status_code == 200
    deleted_policy = response.json()
    assert deleted_policy["id"] == policy["id"]

    # Verify the policy is deleted
    response = client.get(f"/policies/{policy['id']}")
    assert response.status_code == 404
