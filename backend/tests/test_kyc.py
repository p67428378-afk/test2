from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.kyc import CustomerKYC, KYCStatus

def test_create_kyc(client: TestClient, db_session: Session):
    response = client.post("/api/v1/kyc/", json={"customer_id": "12345", "aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    assert response.status_code == 200
    data = response.json()
    assert data["customer_id"] == "12345"
    assert data["final_kyc_status"] == "PENDING"

    kyc_in_db = db_session.query(CustomerKYC).filter(CustomerKYC.customer_id == "12345").first()
    assert kyc_in_db is not None
    assert kyc_in_db.aadhaar_number == "123456789012"
    assert kyc_in_db.pan_number == "ABCDE1234F"

def test_get_kyc_status(client: TestClient, db_session: Session):
    # First create a KYC record
    client.post("/api/v1/kyc/", json={"customer_id": "12345", "aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    kyc_in_db = db_session.query(CustomerKYC).filter(CustomerKYC.customer_id == "12345").first()

    response = client.get(f"/api/v1/kyc/{kyc_in_db.id}/status")
    assert response.status_code == 200
    data = response.json()
    assert data["final_kyc_status"] == "PENDING"

def test_get_audit_trail(client: TestClient, db_session: Session):
    # First create a KYC record
    client.post("/api/v1/kyc/", json={"customer_id": "12345", "aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"})
    kyc_in_db = db_session.query(CustomerKYC).filter(CustomerKYC.customer_id == "12345").first()

    response = client.get(f"/api/v1/kyc/{kyc_in_db.id}/audit")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
