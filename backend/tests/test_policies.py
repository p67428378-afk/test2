
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models
import datetime

def test_create_policy_holder(client: TestClient, db_session: Session):
    response = client.post(
        "/api/policy-holders",
        json={"name": "John Doe", "address": "123 Main St", "contact_info": "john.doe@example.com"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["address"] == "123 Main St"
    assert data["contact_info"] == "john.doe@example.com"
    assert "id" in data

    policy_holder = db_session.query(models.PolicyHolder).filter(models.PolicyHolder.id == data["id"]).first()
    assert policy_holder is not None
    assert policy_holder.name == "John Doe"

def test_get_policy_holder(client: TestClient, db_session: Session):
    # First create a policy holder
    response = client.post(
        "/api/policy-holders",
        json={"name": "Jane Doe", "address": "456 Oak St", "contact_info": "jane.doe@example.com"},
    )
    assert response.status_code == 200
    created_data = response.json()
    policy_holder_id = created_data["id"]

    # Now get the policy holder
    response = client.get(f"/api/policy-holders/{policy_holder_id}")
    assert response.status_code == 200
    retrieved_data = response.json()
    assert retrieved_data["name"] == "Jane Doe"
    assert retrieved_data["address"] == "456 Oak St"
    assert retrieved_data["contact_info"] == "jane.doe@example.com"
    assert retrieved_data["id"] == policy_holder_id

def test_create_policy(client: TestClient, db_session: Session):
    # First create a policy holder
    response = client.post(
        "/api/policy-holders",
        json={"name": "Jake Doe", "address": "789 Pine St", "contact_info": "jake.doe@example.com"},
    )
    assert response.status_code == 200
    policy_holder_data = response.json()
    policy_holder_id = policy_holder_data["id"]

    # Now create a policy for the policy holder
    policy_data = {
        "policy_number": "POL-001",
        "plan_type": "Gold",
        "premium_amount": 500.0,
        "effective_date": str(datetime.date(2024, 1, 1)),
        "expiration_date": str(datetime.date(2024, 12, 31)),
        "status": "Active",
    }
    response = client.post(f"/api/policy-holders/{policy_holder_id}/policies", json=policy_data)
    assert response.status_code == 200
    created_policy = response.json()
    assert created_policy["policy_number"] == "POL-001"
    assert created_policy["plan_type"] == "Gold"
    assert created_policy["premium_amount"] == 500.0
    assert created_policy["status"] == "Active"
    assert "id" in created_policy

    policy = db_session.query(models.Policy).filter(models.Policy.id == created_policy["id"]).first()
    assert policy is not None
    assert policy.policy_holder_id == policy_holder_id

def test_get_policy(client: TestClient, db_session: Session):
    # First create a policy holder and a policy
    response = client.post(
        "/api/policy-holders",
        json={"name": "Jim Doe", "address": "101 Maple St", "contact_info": "jim.doe@example.com"},
    )
    policy_holder_data = response.json()
    policy_holder_id = policy_holder_data["id"]
    policy_data = {
        "policy_number": "POL-002",
        "plan_type": "Silver",
        "premium_amount": 300.0,
        "effective_date": str(datetime.date(2024, 1, 1)),
        "expiration_date": str(datetime.date(2024, 12, 31)),
        "status": "Active",
    }
    response = client.post(f"/api/policy-holders/{policy_holder_id}/policies", json=policy_data)
    created_policy = response.json()
    policy_id = created_policy["id"]

    # Now get the policy
    response = client.get(f"/api/policies/{policy_id}")
    assert response.status_code == 200
    retrieved_policy = response.json()
    assert retrieved_policy["policy_number"] == "POL-002"
    assert retrieved_policy["id"] == policy_id

def test_update_policy_holder(client: TestClient, db_session: Session):
    # First create a policy holder
    response = client.post(
        "/api/policy-holders",
        json={"name": "Jack Doe", "address": "321 Elm St", "contact_info": "jack.doe@example.com"},
    )
    assert response.status_code == 200
    created_data = response.json()
    policy_holder_id = created_data["id"]

    # Now update the policy holder
    update_data = {"address": "654 Pine St", "contact_info": "jack.doe.new@example.com"}
    response = client.put(f"/api/policy-holders/{policy_holder_id}", json=update_data)
    assert response.status_code == 200
    updated_data = response.json()
    assert updated_data["address"] == "654 Pine St"
    assert updated_data["contact_info"] == "jack.doe.new@example.com"

    # Verify the update in the database
    db_policy_holder = db_session.query(models.PolicyHolder).filter(models.PolicyHolder.id == policy_holder_id).first()
    assert db_policy_holder.address == "654 Pine St"
    assert db_policy_holder.contact_info == "jack.doe.new@example.com"

def test_cancel_policy(client: TestClient, db_session: Session):
    # First create a policy holder and a policy
    response = client.post(
        "/api/policy-holders",
        json={"name": "Jill Doe", "address": "987 Birch St", "contact_info": "jill.doe@example.com"},
    )
    policy_holder_data = response.json()
    policy_holder_id = policy_holder_data["id"]
    policy_data = {
        "policy_number": "POL-003",
        "plan_type": "Bronze",
        "premium_amount": 200.0,
        "effective_date": str(datetime.date(2024, 1, 1)),
        "expiration_date": str(datetime.date(2024, 12, 31)),
        "status": "Active",
    }
    response = client.post(f"/api/policy-holders/{policy_holder_id}/policies", json=policy_data)
    created_policy = response.json()
    policy_id = created_policy["id"]

    # Now cancel the policy
    response = client.put(f"/api/policies/{policy_id}/cancel")
    assert response.status_code == 200
    cancelled_policy = response.json()
    assert cancelled_policy["status"] == "Cancelled"

    # Verify the update in the database
    db_policy = db_session.query(models.Policy).filter(models.Policy.id == policy_id).first()
    assert db_policy.status == "Cancelled"
