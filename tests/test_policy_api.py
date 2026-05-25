from fastapi.testclient import TestClient
from unittest.mock import patch
from datetime import date, timedelta
from backend import schemas

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Policyholder Self-Service API"}

@patch('backend.routers.policy.policy_service.get_policy')
def test_get_policy_details(mock_get_policy, client: TestClient):
    # Mock the service function
    mock_policy = schemas.PolicyResponse(
        id="test-policy-id",
        policy_number="POL123",
        policy_type="Gold Plan",
        effective_date=date(2024, 1, 1),
        expiration_date=date(2025, 1, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=200.00,
        policyholder_id="policyholder-123",
        policyholder=schemas.PolicyholderResponse(
            id="policyholder-123",
            name="John Doe",
            address="123 Main St",
            contact_info="john@example.com",
            date_of_birth=date(1990, 1, 1)
        )
    )
    mock_get_policy.return_value = mock_policy

    response = client.get("/policy/test-policy-id")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_number"] == "POL123"
    assert data["status"] == "Active"
    assert data["policyholder"]["name"] == "John Doe"

@patch('backend.routers.policy.policy_service.get_policy')
def test_get_policy_details_not_found(mock_get_policy, client: TestClient):
    # Mock the service function to raise an exception
    from fastapi import HTTPException
    mock_get_policy.side_effect = HTTPException(status_code=404, detail="Policy not found")

    response = client.get("/policy/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Policy not found"}

@patch('backend.routers.policy.policy_service.update_policy_coverage')
def test_update_coverage_options(mock_update_coverage, client: TestClient):
    mock_policy = schemas.PolicyResponse(
        id="test-policy-id",
        policy_number="POL456",
        policy_type="Silver Plan",
        effective_date=date(2023, 6, 1),
        expiration_date=date(2024, 6, 1),
        billing_date=date(2024, 10, 1),
        status="Active",
        premium_amount=150.00,
        policyholder_id="policyholder-456",
        policyholder=schemas.PolicyholderResponse(
            id="policyholder-456",
            name="Jane Doe",
            address="456 Oak Ave",
            contact_info="jane@example.com",
            date_of_birth=date(1985, 5, 10)
        )
    )
    mock_update_coverage.return_value = mock_policy

    coverage_update = {
        "coverage_type": "Dental",
        "details": "Premium Dental Plan",
        "start_date": (date.today() + timedelta(days=30)).isoformat(),
        "end_date": (date.today() + timedelta(days=365)).isoformat()
    }

    response = client.put("/policy/test-policy-id/coverage", json=coverage_update)
    assert response.status_code == 200
    assert response.json()["status"] == "Active"

@patch('backend.routers.policy.policy_service.cancel_policy')
def test_cancel_policy(mock_cancel_policy, client: TestClient):
    mock_policy = schemas.PolicyResponse(
        id="test-policy-id",
        policy_number="POL000",
        policy_type="Platinum Plan",
        effective_date=date(2024, 1, 1),
        expiration_date=date(2025, 1, 1),
        billing_date=date(2024, 10, 1),
        status="Cancelled",
        premium_amount=300.00,
        policyholder_id="policyholder-000",
        policyholder=schemas.PolicyholderResponse(
            id="policyholder-000",
            name="Alice Wonderland",
            address="Wonderland",
            contact_info="alice@example.com",
            date_of_birth=date(1865, 1, 1)
        )
    )
    mock_cancel_policy.return_value = mock_policy

    response = client.delete("/policy/test-policy-id")
    assert response.status_code == 200
    assert response.json()["status"] == "Cancelled"
