
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.main import app, get_db
from backend import models
from datetime import date


@pytest.fixture(scope="function")
def override_get_db(session: Session):
    def _override():
        try:
            yield session
        finally:
            pass
    return _override


@pytest.fixture(scope="function")
def client(session: Session, override_get_db):
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]


def test_create_and_read_policy(client: TestClient, session: Session):
    # Create a policy holder
    policy_holder = models.PolicyHolder(name="John Doe", contact_information="john.doe@example.com", address="123 Main St")
    session.add(policy_holder)
    session.commit()
    session.refresh(policy_holder)

    # Create a policy
    policy = models.Policy(
        policy_holder_id=policy_holder.id,
        coverage_type="Gold Plan",
        start_date=date(2023, 1, 1),
        end_date=date(2024, 1, 1),
        premium_amount=300.0,
        status="Active"
    )
    session.add(policy)
    session.commit()
    session.refresh(policy)

    # Read the policy
    response = client.get(f"/policies/{policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["coverage_type"] == "Gold Plan"
    assert data["status"] == "Active"

def test_update_policy(client: TestClient, session: Session):
    # Create a.policy holder
    policy_holder = models.PolicyHolder(name="Jane Doe", contact_information="jane.doe@example.com", address="456 Oak St")
    session.add(policy_holder)
    session.commit()
    session.refresh(policy_holder)

    # Create a policy
    policy = models.Policy(
        policy_holder_id=policy_holder.id,
        coverage_type="Silver Plan",
        start_date=date(2023, 1, 1),
        end_date=date(2024, 1, 1),
        premium_amount=200.0,
        status="Active"
    )
    session.add(policy)
    session.commit()
    session.refresh(policy)

    # Update the policy
    response = client.put(f"/policies/{policy.id}", json={"status": "Pending Update"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Pending Update"

def test_cancel_policy(client: TestClient, session: Session):
    # Create a policy holder
    policy_holder = models.PolicyHolder(name="Jim Beam", contact_information="jim.beam@example.com", address="789 Pine St")
    session.add(policy_holder)
    session.commit()
    session.refresh(policy_holder)

    # Create a policy
    policy = models.Policy(
        policy_holder_id=policy_holder.id,
        coverage_type="Bronze Plan",
        start_date=date(2023, 1, 1),
        end_date=date(2024, 1, 1),
        premium_amount=100.0,
        status="Active"
    )
    session.add(policy)
    session.commit()
    session.refresh(policy)

    # Cancel the policy
    response = client.delete(f"/policies/{policy.id}/cancel")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Policy cancellation request submitted successfully"

    # Verify the policy status is updated
    response = client.get(f"/policies/{policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Cancelled"
