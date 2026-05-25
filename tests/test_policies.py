
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend import schemas

def test_create_policy_update_request(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/policies/requests/",
        json={"policy_id": "policy-123", "request_type": "UPDATE", "request_details": {"new_beneficiary": "Jane Doe"}, "submitted_by": "user-abc"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["policy_id"] == "policy-123"
    assert data["request_type"] == "UPDATE"
    assert data["request_details"] == {"new_beneficiary": "Jane Doe"}
    assert data["submitted_by"] == "user-abc"
    assert data["request_status"] == "PENDING"

def test_create_policy_cancellation_request(client: TestClient, session: Session):
    response = client.post(
        "/api/v1/policies/requests/",
        json={"policy_id": "policy-456", "request_type": "CANCEL", "submitted_by": "user-def"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["policy_id"] == "policy-456"
    assert data["request_type"] == "CANCEL"
    assert data["submitted_by"] == "user-def"
    assert data["request_status"] == "PENDING"

def test_get_policy_requests(client: TestClient, session: Session):
    client.post(
        "/api/v1/policies/requests/",
        json={"policy_id": "policy-789", "request_type": "UPDATE", "request_details": {"address": "123 Main St"}, "submitted_by": "user-ghi"}
    )
    client.post(
        "/api/v1/policies/requests/",
        json={"policy_id": "policy-789", "request_type": "CANCEL", "submitted_by": "user-ghi"}
    )

    response = client.get("/api/v1/policies/policy-789/requests/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["policy_id"] == "policy-789"
    assert data[1]["policy_id"] == "policy-789"

def test_get_policy(client: TestClient):
    # This test will be mocked, as it depends on an external system
    response = client.get("/api/v1/policies/policy-123")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_id"] == "policy-123"

