from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from .. import models

def test_generate_balance_certificate_success(client: TestClient, db_session: Session):
    # Arrange
    account_number = "123456789"
    purpose = "VISA"
    request_data = {"accountNumber": account_number, "purpose": purpose}

    # Act
    response = client.post("/api/v1/certificates/balance", json=request_data)

    # Assert
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "attachment" in response.headers["content-disposition"]
    assert ".pdf" in response.headers["content-disposition"]

    # Check database record
    db_record = db_session.query(models.CertificateRequest).filter_by(accountNumber=account_number).first()
    assert db_record is not None
    assert db_record.purpose == models.PurposeEnum.VISA
    assert db_record.status == models.StatusEnum.GENERATED
    assert db_record.generatedPdfPath is not None

def test_generate_balance_certificate_account_not_found(client: TestClient, monkeypatch):
    # Arrange
    def mock_get_account_details_from_cbs(account_number: str):
        return None

    monkeypatch.setattr("backend.services.get_account_details_from_cbs", mock_get_account_details_from_cbs)
    request_data = {"accountNumber": "999999999", "purpose": "LOAN"}

    # Act
    response = client.post("/api/v1/certificates/balance", json=request_data)

    # Assert
    assert response.status_code == 404
    assert response.json() == {"detail": "Account not found"}

def test_generate_balance_certificate_cbs_down(client: TestClient, monkeypatch):
    # Arrange
    def mock_get_account_details_from_cbs(account_number: str):
        raise ConnectionError("CBS is down")

    monkeypatch.setattr("backend.services.get_account_details_from_cbs", mock_get_account_details_from_cbs)
    request_data = {"accountNumber": "123456789", "purpose": "LOAN"}

    # Act
    response = client.post("/api/v1/certificates/balance", json=request_data)

    # Assert
    assert response.status_code == 503
    assert "Could not connect to Core Banking System" in response.json()["detail"]
