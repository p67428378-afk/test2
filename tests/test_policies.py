from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import crud, schemas

def test_create_policy(session: Session):
    policy_holder_data = schemas.PolicyHolderCreate(name="John Doe", contact_information="john.doe@example.com", address="123 Main St")
    db_policy_holder = crud.create_policy_holder(session, policy_holder_data)

    policy_data = schemas.PolicyCreate(
        coverage_type="Gold",
        start_date="2023-01-01",
        end_date="2024-01-01",
        premium_amount=300.0,
        status="Active",
    )
    db_policy = crud.create_policy(session, policy=policy_data, policy_holder_id=db_policy_holder.id)
    assert db_policy.coverage_type == policy_data.coverage_type

def test_get_policy(client: TestClient, session: Session):
    policy_holder_data = schemas.PolicyHolderCreate(name="Jane Doe", contact_information="jane.doe@example.com", address="456 Oak St")
    db_policy_holder = crud.create_policy_holder(session, policy_holder_data)

    policy_data = schemas.PolicyCreate(
        coverage_type="Silver",
        start_date="2023-01-01",
        end_date="2024-01-01",
        premium_amount=200.0,
        status="Active",
    )
    db_policy = crud.create_policy(session, policy=policy_data, policy_holder_id=db_policy_holder.id)

    response = client.get(f"/api/policies/{db_policy.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["coverage_type"] == "Silver"
    assert data["id"] == db_policy.id

def test_update_policy(client: TestClient, session: Session):
    policy_holder_data = schemas.PolicyHolderCreate(name="Jake Doe", contact_information="jake.doe@example.com", address="789 Pine St")
    db_policy_holder = crud.create_policy_holder(session, policy_holder_data)

    policy_data = schemas.PolicyCreate(
        coverage_type="Bronze",
        start_date="2023-01-01",
        end_date="2024-01-01",
        premium_amount=100.0,
        status="Active",
    )
    db_policy = crud.create_policy(session, policy=policy_data, policy_holder_id=db_policy_holder.id)

    update_data = {"contact_information": "jake.doe@new-email.com"}
    response = client.put(f"/api/policies/{db_policy.id}", json=update_data)
    assert response.status_code == 200

    get_response = client.get(f"/api/policies/{db_policy.id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["policy_holder"]["contact_information"] == "jake.doe@new-email.com"

def test_cancel_policy(client: TestClient, session: Session):
    policy_holder_data = schemas.PolicyHolderCreate(name="Jill Doe", contact_information="jill.doe@example.com", address="101 Maple St")
    db_policy_holder = crud.create_policy_holder(session, policy_holder_data)

    policy_data = schemas.PolicyCreate(
        coverage_type="Platinum",
        start_date="2023-01-01",
        end_date="2024-01-01",
        premium_amount=500.0,
        status="Active",
    )
    db_policy = crud.create_policy(session, policy=policy_data, policy_holder_id=db_policy_holder.id)

    response = client.delete(f"/api/policies/{db_policy.id}/cancel")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Cancelled"
