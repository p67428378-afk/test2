from fastapi.testclient import TestClient
from app.schemas.kyc import KycStatus, KycResponse


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_successful_kyc_onboarding(client: TestClient, mocker):
    mocker.patch(
        "app.api.endpoints.kyc.kyc_service.process_kyc",
        return_value=KycResponse(customer_id="123", status=KycStatus.APPROVED, message="KYC process completed successfully."),
    )
    response = client.post(
        "/api/v1/kyc",
        json={"full_name": "John Doe", "aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KycStatus.APPROVED.value
    assert data["message"] == "KYC process completed successfully."

def test_kyc_onboarding_invalid_aadhaar(client: TestClient, mocker):
    mocker.patch(
        "app.api.endpoints.kyc.kyc_service.process_kyc",
        return_value=KycResponse(customer_id="123", status=KycStatus.FLAGGED, message="Aadhaar validation failed"),
    )
    response = client.post(
        "/api/v1/kyc",
        json={"full_name": "Jane Doe", "aadhaar_number": "invalid", "pan_number": "ABCDE1234F"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KycStatus.FLAGGED.value
    assert "Aadhaar validation failed" in data["message"]

def test_kyc_onboarding_invalid_pan(client: TestClient, mocker):
    mocker.patch(
        "app.api.endpoints.kyc.kyc_service.process_kyc",
        return_value=KycResponse(customer_id="123", status=KycStatus.FLAGGED, message="PAN validation failed"),
    )
    response = client.post(
        "/api/v1/kyc",
        json={"full_name": "Jane Doe", "aadhaar_number": "123456789012", "pan_number": "invalid"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KycStatus.FLAGGED.value
    assert "PAN validation failed" in data["message"]

def test_kyc_onboarding_sanctioned_customer(client: TestClient, mocker):
    mocker.patch(
        "app.api.endpoints.kyc.kyc_service.process_kyc",
        return_value=KycResponse(customer_id="123", status=KycStatus.FLAGGED, message="Customer is on the sanctions list"),
    )
    response = client.post(
        "/api/v1/kyc",
        json={"full_name": "Sanctioned Person", "aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KycStatus.FLAGGED.value
    assert "Customer is on the sanctions list" in data["message"]
