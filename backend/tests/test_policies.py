from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from faker import Faker

from app.core.config import settings
from app.schemas.policy import PolicyCreate, PolicyUpdate

fake = Faker()

def test_create_policy(client: TestClient, db_session: Session):
    policy_in = PolicyCreate(
        policy_holder_id=fake.uuid4(),
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Gold Plan",
        premium_amount=300.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    response = client.post("/api/v1/policies/", json=policy_in.model_dump(mode='json'))
    assert response.status_code == 200
    data = response.json()
    assert data["plan_type"] == policy_in.plan_type
    assert data["premium_amount"] == policy_in.premium_amount

def test_get_policy(client: TestClient, db_session: Session):
    policy_in = PolicyCreate(
        policy_holder_id=fake.uuid4(),
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Gold Plan",
        premium_amount=300.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    response = client.post("/api/v1/policies/", json=policy_in.model_dump(mode='json'))
    assert response.status_code == 200
    created_policy = response.json()

    response = client.get(f"/api/v1/policies/{created_policy['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_policy["id"]

def test_get_policies_by_holder(client: TestClient, db_session: Session):
    policy_holder_id = fake.uuid4()
    policy_in_1 = PolicyCreate(
        policy_holder_id=policy_holder_id,
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Gold Plan",
        premium_amount=300.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    client.post("/api/v1/policies/", json=policy_in_1.model_dump(mode='json'))

    policy_in_2 = PolicyCreate(
        policy_holder_id=policy_holder_id,
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Silver Plan",
        premium_amount=200.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    client.post("/api/v1/policies/", json=policy_in_2.model_dump(mode='json'))

    response = client.get(f"/api/v1/policies/holder/{policy_holder_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_update_policy(client: TestClient, db_session: Session):
    policy_in = PolicyCreate(
        policy_holder_id=fake.uuid4(),
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Gold Plan",
        premium_amount=300.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    response = client.post("/api/v1/policies/", json=policy_in.model_dump(mode='json'))
    assert response.status_code == 200
    created_policy = response.json()

    policy_update = PolicyUpdate(plan_type="Platinum Plan", premium_amount=500.00, effective_date=fake.date_object(), expiration_date=fake.date_object())
    response = client.put(f"/api/v1/policies/{created_policy['id']}", json=policy_update.model_dump(mode='json'))
    assert response.status_code == 200
    data = response.json()
    assert data["plan_type"] == "Platinum Plan"
    assert data["premium_amount"] == 500.00

def test_cancel_policy(client: TestClient, db_session: Session):
    policy_in = PolicyCreate(
        policy_holder_id=fake.uuid4(),
        policy_number=fake.unique.pystr(min_chars=10, max_chars=10),
        plan_type="Gold Plan",
        premium_amount=300.00,
        effective_date=fake.date_object(),
        expiration_date=fake.date_object(),
    )
    response = client.post("/api/v1/policies/", json=policy_in.model_dump(mode='json'))
    assert response.status_code == 200
    created_policy = response.json()

    response = client.delete(f"/api/v1/policies/{created_policy['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "cancelled"

def test_get_non_existent_policy(client: TestClient, db_session: Session):
    response = client.get(f"/api/v1/policies/{fake.uuid4()}")
    assert response.status_code == 404

def test_update_non_existent_policy(client: TestClient, db_session: Session):
    policy_update = PolicyUpdate(plan_type="Platinum Plan", premium_amount=500.00, effective_date=fake.date_object(), expiration_date=fake.date_object())
    response = client.put(f"/api/v1/policies/{fake.uuid4()}", json=policy_update.model_dump(mode='json'))
    assert response.status_code == 404

def test_cancel_non_existent_policy(client: TestClient, db_session: Session):
    response = client.delete(f"/api/v1/policies/{fake.uuid4()}")
    assert response.status_code == 404
