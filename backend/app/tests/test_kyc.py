from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.models.kyc import KYCStatus

client = TestClient(app)

def test_successful_kyc_onboarding(mocker):
    # Mock external services
    mocker.patch("backend.app.services.kyc_service.validate_aadhaar", return_value=True)
    mocker.patch("backend.app.services.kyc_service.validate_pan", return_value=True)
    mocker.patch("backend.app.services.kyc_service.check_sanctions_list", return_value=False)

    response = client.post("/api/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KYCStatus.APPROVED

def test_aadhaar_validation_failure(mocker):
    # Mock external services
    mocker.patch("backend.app.services.kyc_service.validate_aadhaar", return_value=False)
    mocker.patch("backend.app.services.kyc_service.validate_pan", return_value=True)
    mocker.patch("backend.app.services.kyc_service.check_sanctions_list", return_value=False)

    response = client.post("/api/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KYCStatus.FLAGGED

def test_pan_validation_failure(mocker):
    # Mock external services
    mocker.patch("backend.app.services.kyc_service.validate_aadhaar", return_value=True)
    mocker.patch("backend.app.services.kyc_service.validate_pan", return_value=False)
    mocker.patch("backend.app.services.kyc_service.check_sanctions_list", return_value=False)

    response = client.post("/api/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KYCStatus.FLAGGED

def test_sanctions_list_match(mocker):
    # Mock external services
    mocker.patch("backend.app.services.kyc_service.validate_aadhaar", return_value=True)
    mocker.patch("backend.app.services.kyc_service.validate_pan", return_value=True)
    mocker.patch("backend.app.services.kyc_service.check_sanctions_list", return_value=True)

    response = client.post("/api/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == KYCStatus.FLAGGED
