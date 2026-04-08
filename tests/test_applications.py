from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import date

def test_create_application(client: TestClient, session: Session):
    # First, create an applicant
    applicant_data = {
        "user_id": "app_user_1",
        "full_name": "Alice Wonderland",
        "address": "Wonderland",
        "phone_number": "555-111-2222",
        "email_address": "alice@example.com",
        "date_of_birth": "1995-05-05"
    }
    applicant_response = client.post("/applicants/", json=applicant_data)
    applicant_id = applicant_response.json()["applicant_id"]

    application_data = {
        "applicant_id": applicant_id,
        "credit_card_product_id": "product_abc"
    }
    response = client.post("/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["applicant_id"] == applicant_id
    assert data["credit_card_product_id"] == "product_abc"
    assert data["status"] == "PENDING"
    assert "application_id" in data

def test_create_application_applicant_not_found(client: TestClient, session: Session):
    application_data = {
        "applicant_id": "non_existent_applicant",
        "credit_card_product_id": "product_xyz"
    }
    response = client.post("/applications/", json=application_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Applicant not found"}

def test_read_application(client: TestClient, session: Session):
    # First, create an applicant
    applicant_data = {
        "user_id": "app_user_2",
        "full_name": "Bob The Builder",
        "address": "Construction Site",
        "phone_number": "555-333-4444",
        "email_address": "bob@example.com",
        "date_of_birth": "1980-01-01"
    }
    applicant_response = client.post("/applicants/", json=applicant_data)
    applicant_id = applicant_response.json()["applicant_id"]

    # Then, create an application
    application_data = {
        "applicant_id": applicant_id,
        "credit_card_product_id": "product_def"
    }
    create_response = client.post("/applications/", json=application_data)
    application_id = create_response.json()["application_id"]

    response = client.get(f"/applications/{application_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == application_id
    assert data["applicant"]["full_name"] == "Bob The Builder"

def test_read_application_not_found(client: TestClient, session: Session):
    response = client.get("/applications/non_existent_application")
    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}

def test_create_financial_info(client: TestClient, session: Session):
    # Create applicant
    applicant_data = {
        "user_id": "app_user_3",
        "full_name": "Charlie Chaplin",
        "address": "Hollywood",
        "phone_number": "555-555-6666",
        "email_address": "charlie@example.com",
        "date_of_birth": "1889-04-16"
    }
    applicant_response = client.post("/applicants/", json=applicant_data)
    applicant_id = applicant_response.json()["applicant_id"]

    # Create application
    application_data = {
        "applicant_id": applicant_id,
        "credit_card_product_id": "product_ghi"
    }
    app_response = client.post("/applications/", json=application_data)
    application_id = app_response.json()["application_id"]

    financial_info_data = {
        "annual_income": 70000,
        "credit_score": 750,
        "account_statement_document_id": "doc_123"
    }
    response = client.post(f"/applications/{application_id}/financial-info", json=financial_info_data)
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == application_id
    assert data["annual_income"] == 70000

def test_create_financial_info_application_not_found(client: TestClient, session: Session):
    financial_info_data = {
        "annual_income": 80000,
        "credit_score": 700,
        "account_statement_document_id": "doc_456"
    }
    response = client.post("/applications/non_existent_application/financial-info", json=financial_info_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}

def test_create_employment_info(client: TestClient, session: Session):
    # Create applicant
    applicant_data = {
        "user_id": "app_user_4",
        "full_name": "Diana Prince",
        "address": "Themyscira",
        "phone_number": "555-777-8888",
        "email_address": "diana@example.com",
        "date_of_birth": "1970-01-01"
    }
    applicant_response = client.post("/applicants/", json=applicant_data)
    applicant_id = applicant_response.json()["applicant_id"]

    # Create application
    application_data = {
        "applicant_id": applicant_id,
        "credit_card_product_id": "product_jkl"
    }
    app_response = client.post("/applications/", json=application_data)
    application_id = app_response.json()["application_id"]

    employment_info_data = {
        "employer_name": "Justice League",
        "employer_address": "Hall of Justice",
        "job_title": "Superhero",
        "employment_start_date": "2000-01-01"
    }
    response = client.post(f"/applications/{application_id}/employment-info", json=employment_info_data)
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == application_id
    assert data["employer_name"] == "Justice League"

def test_create_employment_info_application_not_found(client: TestClient, session: Session):
    employment_info_data = {
        "employer_name": "Daily Planet",
        "employer_address": "Metropolis",
        "job_title": "Reporter",
        "employment_start_date": "1999-01-01"
    }
    response = client.post("/applications/non_existent_application/employment-info", json=employment_info_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}
