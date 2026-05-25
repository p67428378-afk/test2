from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.schemas.policy import PolicyCreate, PolicyUpdate
from app.models.policy import Policy, PolicyHolder
import uuid
from datetime import date


def test_create_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="John Doe", address="123 Main St", contact_info="john.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    policy_data = {
        "policy_number": f"POL-{uuid.uuid4()}",
        "plan_type": "Gold",
        "premium_amount": 500.0,
        "effective_date": "2024-01-01",
        "expiration_date": "2024-12-31",
        "status": "Active",
        "policy_holder_id": policy_holder.id
    }
    response = client.post("/api/v1/policies/", json=policy_data)
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == policy_data["policy_number"]
    assert data["plan_type"] == policy_data["plan_type"]
    assert "id" in data

def test_get_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jane Doe", address="456 Oak St", contact_info="jane.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    policy = Policy(
        policy_number=f"POL-{uuid.uuid4()}",
        plan_type="Silver",
        premium_amount=300.0,
        effective_date=date(2024, 1, 1),
        expiration_date=date(2024, 12, 31),
        status="Active",
        policy_holder_id=policy_holder.id
    )
    db_session.add(policy)
    db_session.commit()
    db_session.refresh(policy)

    response = client.get(f"/api/v1/policies/{policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == policy.policy_number
    assert data["id"] == policy.id

def test_get_all_policies(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jim Doe", address="789 Pine St", contact_info="jim.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    policy1 = Policy(
        policy_number=f"POL-{uuid.uuid4()}",
        plan_type="Bronze",
        premium_amount=200.0,
        effective_date=date(2024, 1, 1),
        expiration_date=date(2024, 12, 31),
        status="Active",
        policy_holder_id=policy_holder.id
    )
    policy2 = Policy(
        policy_number=f"POL-{uuid.uuid4()}",
        plan_type="Platinum",
        premium_amount=700.0,
        effective_date=date(2024, 1, 1),
        expiration_date=date(2024, 12, 31),
        status="Active",
        policy_holder_id=policy_holder.id
    )
    db_session.add_all([policy1, policy2])
    db_session.commit()

    response = client.get("/api/v1/policies/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

def test_update_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jill Doe", address="101 Maple St", contact_info="jill.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    policy = Policy(
        policy_number=f"POL-{uuid.uuid4()}",
        plan_type="Gold",
        premium_amount=500.0,
        effective_date=date(2024, 1, 1),
        expiration_date=date(2024, 12, 31),
        status="Active",
        policy_holder_id=policy_holder.id
    )
    db_session.add(policy)
    db_session.commit()
    db_session.refresh(policy)

    update_data = {"status": "Cancelled"}
    response = client.put(f"/api/v1/policies/{policy.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Cancelled"

def test_delete_policy(client: TestClient, db_session: Session):
    policy_holder = PolicyHolder(name="Jack Doe", address="212 Birch St", contact_info="jack.doe@example.com", authentication_details="auth_details")
    db_session.add(policy_holder)
    db_session.commit()
    db_session.refresh(policy_holder)

    policy = Policy(
        policy_number=f"POL-{uuid.uuid4()}",
        plan_type="Silver",
        premium_amount=300.0,
        effective_date=date(2024, 1, 1),
        expiration_date=date(2024, 12, 31),
        status="Active",
        policy_holder_id=policy_holder.id
    )
    db_session.add(policy)
    db_session.commit()
    db_session.refresh(policy)

    response = client.delete(f"/api/v1/policies/{policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Cancelled"

    response = client.get(f"/api/v1/policies/{policy.id}")
    assert response.status_code == 200
    retrieved_data = response.json()
    assert retrieved_data["status"] == "Cancelled"
