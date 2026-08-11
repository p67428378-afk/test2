from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import schemas, services
from datetime import date

# Assuming 'client' fixture is defined in conftest.py

def test_create_user_router(client: TestClient):
    response = client.post(
        "/api/v1/users/",
        json={
            "username": "testuser_router",
            "email": "test_router@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser_router"
    assert data["email"] == "test_router@example.com"
    assert "id" in data

def test_read_user_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="readuser", email="read@example.com", password="readpassword")
    user = services.create_user(db_session, user_data)

    response = client.get(f"/api/v1/users/{user.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "readuser"
    assert data["email"] == "read@example.com"
    assert data["id"] == str(user.id)

def test_create_applicant_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="app_router_user", email="app_router@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    response = client.post(
        "/api/v1/applicants/",
        json={
            "user_id": str(user.id),
            "full_name": "Router Applicant",
            "phone_number": "999-888-7777",
            "email": "router.applicant@example.com",
            "credit_score": 800,
            "annual_income": 150000.0,
            "mailing_address": "10 Downing St",
            "employer_name": "Gov Corp",
            "job_title": "CEO",
            "employment_start_date": str(date(2018, 1, 1)),
            "employer_address": "White House"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Router Applicant"
    assert data["user_id"] == str(user.id)

def test_read_applicant_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="read_app_user", email="read_app@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Read Applicant",
        phone_number="111-222-3333",
        email="read.applicant@example.com",
        credit_score=750,
        annual_income=100000.0,
        mailing_address="123 Test St",
        employer_name="Test Corp",
        job_title="Tester",
        employment_start_date=date(2020, 1, 1),
        employer_address="456 Test Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    response = client.get(f"/api/v1/applicants/{applicant.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Read Applicant"
    assert data["id"] == str(applicant.id)

def test_update_applicant_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="upd_app_user", email="upd_app@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Update Applicant",
        phone_number="111-222-3333",
        email="update.applicant@example.com",
        credit_score=700,
        annual_income=80000.0,
        mailing_address="456 Update St",
        employer_name="Update Corp",
        job_title="Updater",
        employment_start_date=date(2019, 5, 1),
        employer_address="789 Update Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    response = client.put(
        f"/api/v1/applicants/{applicant.id}",
        json={
            "credit_score": 720,
            "job_title": "Senior Updater"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["credit_score"] == 720
    assert data["job_title"] == "Senior Updater"

def test_create_credit_card_router(client: TestClient):
    response = client.post(
        "/api/v1/credit_cards/",
        json={
            "name": "Router Card",
            "description": "A router test credit card",
            "apr": 17.5,
            "cashback_rate": 1.0,
            "annual_fee": 25.0,
            "features": "router features",
            "credit_limit": 8000.0
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Router Card"

def test_read_credit_card_router(client: TestClient, db_session: Session):
    card_data = schemas.CreditCardCreate(
        name="Read Router Card",
        description="Read router test card",
        apr=16.0,
        cashback_rate=0.5,
        annual_fee=0.0,
        features="read features",
        credit_limit=3000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    response = client.get(f"/api/v1/credit_cards/{credit_card.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Read Router Card"
    assert data["id"] == str(credit_card.id)

def test_create_application_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="app_create_user", email="app_create@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="App Create Applicant",
        phone_number="555-111-2222",
        email="app.create.applicant@example.com",
        credit_score=770,
        annual_income=130000.0,
        mailing_address="333 App St",
        employer_name="App Solutions",
        job_title="App Developer",
        employment_start_date=date(2021, 6, 1),
        employer_address="444 App Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    card_data = schemas.CreditCardCreate(
        name="App Create Card",
        description="App create test card",
        apr=19.0,
        cashback_rate=2.5,
        annual_fee=75.0,
        features="app features",
        credit_limit=12000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    response = client.post(
        "/api/v1/applications/",
        json={
            "applicant_id": str(applicant.id),
            "credit_card_id": str(credit_card.id)
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["applicant_id"] == str(applicant.id)
    assert data["credit_card_id"] == str(credit_card.id)
    assert data["status"] == "Pending"
    assert data["submission_date"] == str(date.today())

def test_read_application_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="read_app_user_2", email="read_app_2@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Read App Applicant 2",
        phone_number="555-333-4444",
        email="read.app.applicant.2@example.com",
        credit_score=790,
        annual_income=140000.0,
        mailing_address="555 Read St",
        employer_name="Read Solutions",
        job_title="Read Developer",
        employment_start_date=date(2022, 9, 1),
        employer_address="666 Read Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    card_data = schemas.CreditCardCreate(
        name="Read App Card 2",
        description="Read app test card 2",
        apr=17.0,
        cashback_rate=1.0,
        annual_fee=0.0,
        features="read app features",
        credit_limit=9000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    application_data = schemas.ApplicationCreate(
        applicant_id=applicant.id,
        credit_card_id=credit_card.id
    )
    application = services.create_application(db_session, application_data)

    response = client.get(f"/api/v1/applications/{application.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["applicant_id"] == str(applicant.id)
    assert data["credit_card_id"] == str(credit_card.id)
    assert data["id"] == str(application.id)

def test_update_application_router(client: TestClient, db_session: Session):
    user_data = schemas.UserCreate(username="upd_app_user_2", email="upd_app_2@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Update App Applicant 2",
        phone_number="555-555-6666",
        email="update.app.applicant.2@example.com",
        credit_score=780,
        annual_income=135000.0,
        mailing_address="777 Update App St",
        employer_name="Update App Solutions",
        job_title="Update App Developer",
        employment_start_date=date(2022, 3, 1),
        employer_address="888 Update App Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    card_data = schemas.CreditCardCreate(
        name="Update App Card 2",
        description="Update app test card 2",
        apr=18.5,
        cashback_rate=1.5,
        annual_fee=50.0,
        features="update app features",
        credit_limit=11000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    application_data = schemas.ApplicationCreate(
        applicant_id=applicant.id,
        credit_card_id=credit_card.id
    )
    application = services.create_application(db_session, application_data)

    response = client.put(
        f"/api/v1/applications/{application.id}",
        json={
            "status": "Approved",
            "denial_reason": None
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Approved"
    assert data["denial_reason"] is None
    assert data["last_updated_date"] == str(date.today())
