from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import date

def test_create_applicant(client: TestClient, session: Session):
    applicant_data = {
        "user_id": "test_user_123",
        "full_name": "John Doe",
        "address": "123 Main St",
        "phone_number": "123-456-7890",
        "email_address": "john.doe@example.com",
        "date_of_birth": "1990-01-01"
    }
    response = client.post("/applicants/", json=applicant_data)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "John Doe"
    assert "applicant_id" in data

    db_applicant = session.query(models.Applicant).filter(models.Applicant.user_id == "test_user_123").first()
    assert db_applicant is not None
    assert db_applicant.full_name == "John Doe"

def test_create_applicant_duplicate_user_id(client: TestClient, session: Session):
    applicant_data_1 = {
        "user_id": "test_user_456",
        "full_name": "Jane Doe",
        "address": "456 Oak Ave",
        "phone_number": "098-765-4321",
        "email_address": "jane.doe.1@example.com", # Unique email
        "date_of_birth": "1992-02-02"
    }
    applicant_data_2 = {
        "user_id": "test_user_456", # Duplicate user_id
        "full_name": "Jane Doe Two",
        "address": "789 Pine St",
        "phone_number": "098-765-4322",
        "email_address": "jane.doe.2@example.com", # Unique email
        "date_of_birth": "1993-03-03"
    }
    client.post("/applicants/", json=applicant_data_1)
    response = client.post("/applicants/", json=applicant_data_2)
    assert response.status_code == 400
    assert response.json() == {"detail": "Applicant with this user ID already registered"}

def test_read_applicant(client: TestClient, session: Session):
    applicant_data = {
        "user_id": "test_user_789",
        "full_name": "Peter Pan",
        "address": "Neverland",
        "phone_number": "111-222-3333",
        "email_address": "peter.pan@example.com",
        "date_of_birth": "1985-03-03"
    }
    create_response = client.post("/applicants/", json=applicant_data)
    applicant_id = create_response.json()["applicant_id"]

    response = client.get(f"/applicants/{applicant_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Peter Pan"
    assert data["applicant_id"] == applicant_id

def test_read_applicant_not_found(client: TestClient, session: Session):
    response = client.get("/applicants/non_existent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Applicant not found"}
