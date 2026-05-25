from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date

from app.core.config import settings
from app.models.policy import Policy, PolicyHolder

def test_create_policy(client: TestClient, db: Session):
    policy_holder = PolicyHolder(first_name="Test", last_name="User", email="test@example.com")
    db.add(policy_holder)
    db.commit()
    db.refresh(policy_holder)

    data = {
        "policy_number": "POL-001",
        "coverage_type": "Premier Gold PPO",
        "effective_date": "2023-01-01",
        "expiration_date": "2023-12-31",
        "premium_amount": 428.50,
        "status": "Active",
        "policy_holder_id": policy_holder.id,
        "beneficiaries": [
            {
                "name": "Jane Doe",
                "relationship_type": "Spouse",
                "date_of_birth": "1990-01-01"
            }
        ]
    }
    response = client.post(f"{settings.API_V1_STR}/policies/", json=data)
    assert response.status_code == 200
    content = response.json()
    assert content["policy_number"] == data["policy_number"]
    assert "id" in content
    assert len(content["beneficiaries"]) == 1
    assert content["beneficiaries"][0]["name"] == "Jane Doe"

def test_read_policies(client: TestClient, db: Session):
    response = client.get(f"{settings.API_V1_STR}/policies/")
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)

def test_read_policy(client: TestClient, db: Session):
    policy_holder = PolicyHolder(first_name="Test", last_name="User", email="test2@example.com")
    db.add(policy_holder)
    db.commit()
    db.refresh(policy_holder)

    policy = Policy(policy_number="POL-002", coverage_type="Test", effective_date=date(2023, 1, 1), expiration_date=date(2023, 12, 31), premium_amount=100.0, status="Active", policy_holder_id=policy_holder.id)
    db.add(policy)
    db.commit()
    db.refresh(policy)

    response = client.get(f"{settings.API_V1_STR}/policies/{policy.id}")
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == policy.id

def test_update_policy(client: TestClient, db: Session):
    policy_holder = PolicyHolder(first_name="Test", last_name="User", email="test3@example.com")
    db.add(policy_holder)
    db.commit()
    db.refresh(policy_holder)

    policy = Policy(policy_number="POL-003", coverage_type="Test", effective_date=date(2023, 1, 1), expiration_date=date(2023, 12, 31), premium_amount=100.0, status="Active", policy_holder_id=policy_holder.id)
    db.add(policy)
    db.commit()
    db.refresh(policy)

    data = {
        "policy_number": policy.policy_number,
        "coverage_type": policy.coverage_type,
        "effective_date": policy.effective_date.isoformat(),
        "expiration_date": policy.expiration_date.isoformat(),
        "premium_amount": 500.00,
        "status": policy.status,
        "policy_holder_id": policy.policy_holder_id,
        "beneficiaries": []
    }
    response = client.put(f"{settings.API_V1_STR}/policies/{policy.id}", json=data)
    assert response.status_code == 200
    content = response.json()
    assert content["premium_amount"] == 500.00

def test_delete_policy(client: TestClient, db: Session):
    policy_holder = PolicyHolder(first_name="Test", last_name="User", email="test4@example.com")
    db.add(policy_holder)
    db.commit()
    db.refresh(policy_holder)

    policy = Policy(policy_number="POL-004", coverage_type="Test", effective_date=date(2023, 1, 1), expiration_date=date(2023, 12, 31), premium_amount=100.0, status="Active", policy_holder_id=policy_holder.id)
    db.add(policy)
    db.commit()
    db.refresh(policy)

    response = client.delete(f"{settings.API_V1_STR}/policies/{policy.id}")
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == policy.id
    response = client.get(f"{settings.API_V1_STR}/policies/{policy.id}")
    assert response.status_code == 404
