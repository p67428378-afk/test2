
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date

from app.models.policy import Policy, PolicyHolder, PolicyStatus, RequestType


def test_read_policy_holder(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="John Doe", address="123 Main St", contact_info="john.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()

    response = client.get(f"/api/v1/policyholders/{policy_holder.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == policy_holder.name
    assert data["address"] == policy_holder.address

def test_read_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jane Doe", address="456 Oak Ave", contact_info="jane.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()

    policy = Policy(policy_holder_id=policy_holder.id, policy_number="P12345", plan_type="Gold", premium_amount=500.0, effective_date=date(2024, 1, 1), expiration_date=date(2024, 12, 31), status=PolicyStatus.ACTIVE)
    db_session.add(policy)
    db_session.commit()

    response = client.get(f"/api/v1/policies/{policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == policy.policy_number
    assert data["plan_type"] == policy.plan_type

def test_read_policy_not_found(client: TestClient):
    response = client.get("/api/v1/policies/999")
    assert response.status_code == 404

def test_update_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jim Beam", address="789 Pine Ln", contact_info="jim.beam@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()

    policy = Policy(policy_holder_id=policy_holder.id, policy_number="P67890", plan_type="Silver", premium_amount=300.0, effective_date=date(2024, 1, 1), expiration_date=date(2024, 12, 31), status=PolicyStatus.ACTIVE)
    db_session.add(policy)
    db_session.commit()

    update_data = {"plan_type": "Platinum", "premium_amount": 700.0}
    response = client.put(f"/api/v1/policies/{policy.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["plan_type"] == "Platinum"
    assert data["premium_amount"] == 700.0

def test_cancel_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jack Daniels", address="101 Bourbon St", contact_info="jack.daniels@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()

    policy = Policy(policy_holder_id=policy_holder.id, policy_number="P101112", plan_type="Bronze", premium_amount=100.0, effective_date=date(2024, 1, 1), expiration_date=date(2024, 12, 31), status=PolicyStatus.ACTIVE)
    db_session.add(policy)
    db_session.commit()

    response = client.post(f"/api/v1/policies/{policy.id}/cancel")
    assert response.status_code == 200
    data = response.json()
    assert data["request_type"] == RequestType.CANCEL.value
    assert data["status"] == "PENDING"
