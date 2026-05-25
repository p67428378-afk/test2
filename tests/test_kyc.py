
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models
import uuid

def test_create_kyc_request(client: TestClient, session: Session):
    response = client.post("/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["aadhaar_number"] == "123456789012"
    assert data["pan_number"] == "ABCDE1234F"
    assert data["status"] == "PENDING"

    db_request = session.query(models.KYCRequest).filter(models.KYCRequest.id == uuid.UUID(data["id"])).first()
    assert db_request is not None

def test_successful_validation(client: TestClient, session: Session):
    # Create a request first
    response = client.post("/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    request_id = response.json()["id"]

    # Validate the request
    response = client.post(f"/kyc/{request_id}/validate")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "APPROVED"

    db_request = session.query(models.KYCRequest).filter(models.KYCRequest.id == uuid.UUID(request_id)).first()
    assert db_request.status == models.KYCStatus.APPROVED

def test_aadhaar_validation_failure(client: TestClient, session: Session):
    # Create a request with invalid aadhaar
    response = client.post("/kyc/", json={"aadhaar_number": "12345", "pan_number": "ABCDE1234F"})
    request_id = response.json()["id"]

    # Validate the request
    response = client.post(f"/kyc/{request_id}/validate")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "FLAGGED"
    assert data["reason"] == "Aadhaar validation failed"

    db_request = session.query(models.KYCRequest).filter(models.KYCRequest.id == uuid.UUID(request_id)).first()
    assert db_request.status == models.KYCStatus.FLAGGED

def test_pan_validation_failure(client: TestClient, session: Session):
    # Create a request with invalid pan
    response = client.post("/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABC"})
    request_id = response.json()["id"]

    # Validate the request
    response = client.post(f"/kyc/{request_id}/validate")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "FLAGGED"
    assert data["reason"] == "PAN validation failed"

    db_request = session.query(models.KYCRequest).filter(models.KYCRequest.id == uuid.UUID(request_id)).first()
    assert db_request.status == models.KYCStatus.FLAGGED

def test_get_kyc_request(client: TestClient):
    # Create a request first
    response = client.post("/kyc/", json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    request_id = response.json()["id"]

    # Get the request
    response = client.get(f"/kyc/{request_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == request_id

def test_get_non_existent_kyc_request(client: TestClient):
    non_existent_uuid = uuid.uuid4()
    response = client.get(f"/kyc/{non_existent_uuid}")
    assert response.status_code == 404
