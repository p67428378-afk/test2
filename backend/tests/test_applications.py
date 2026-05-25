from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.app import models
import json

def test_create_applicant(client: TestClient):
    applicant_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_number": "123-456-7890",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip_code": "90210",
            "country": "USA"
        },
        "authentication_credentials": "hashed_password_john"
    }
    response = client.post("/api/v1/applicants/", json=applicant_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "john.doe@example.com"
    assert "user_id" in data
    assert data["address"] == applicant_data["address"]

def test_create_duplicate_applicant(client: TestClient):
    applicant_data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com",
        "phone_number": "098-765-4321",
        "address": {
            "street": "456 Oak Ave",
            "city": "Otherville",
            "state": "NY",
            "zip_code": "10001",
            "country": "USA"
        },
        "authentication_credentials": "hashed_password_jane"
    }
    client.post("/api/v1/applicants/", json=applicant_data)
    response = client.post("/api/v1/applicants/", json=applicant_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Applicant with this email already registered"}

def test_create_application(client: TestClient, db_session: Session):
    # Create a product first
    product_data = models.CreditCardProduct(
        name="Test Card for App",
        description="Desc",
        apr=15.0,
        annual_charges=0.0,
        credit_limit_min=1000.0,
        credit_limit_max=5000.0,
        rewards_description="Rewards",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    # Create an applicant first
    applicant_data = models.Applicant(
        first_name="App",
        last_name="User",
        email="app.user@example.com",
        phone_number="111-222-3333",
        address={"street": "101 Pine", "city": "Town", "state": "TX", "zip_code": "77001", "country": "USA"}, # Pass as dict
        authentication_credentials="hashed_app_user"
    )
    db_session.add(applicant_data)
    db_session.commit()
    db_session.refresh(applicant_data)

    application_payload = {
        "user_id": applicant_data.user_id,
        "product_id": product_data.product_id,
        "personal_info": {
            "date_of_birth": "1990-01-01",
            "social_security_number": "XXX-XX-XXXX",
            "employment_status": "Employed",
            "employer": "Google",
            "occupation": "Engineer"
        },
        "financial_info": {
            "annual_income": 60000.0,
            "source_of_income": "Salary",
            "other_income": 5000.0,
            "expenses": 2000.0
        },
        "status": "Pending Review",
        "comments": {"initial": "Application submitted online"}
    }

    response = client.post("/api/v1/applications/", json=application_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == applicant_data.user_id
    assert data["product_id"] == product_data.product_id
    assert data["status"] == "Pending Review"
    assert "application_id" in data
    assert data["personal_info"] == application_payload["personal_info"]
    assert data["financial_info"] == application_payload["financial_info"]


def test_get_application_status(client: TestClient, db_session: Session):
    # Create a product
    product_data = models.CreditCardProduct(
        name="Status Check Card",
        description="Desc",
        apr=18.0,
        annual_charges=0.0,
        credit_limit_min=2000.0,
        credit_limit_max=10000.0,
        rewards_description="Points",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    # Create an applicant
    applicant_data = models.Applicant(
        first_name="Status",
        last_name="Checker",
        email="status.checker@example.com",
        phone_number="444-555-6666",
        address={"street": "202 Elm", "city": "Village", "state": "GA", "zip_code": "30303", "country": "USA"}, # Pass as dict
        authentication_credentials="hashed_status_checker"
    )
    db_session.add(applicant_data)
    db_session.commit()
    db_session.refresh(applicant_data)

    # Create an application directly in DB
    application_personal_info = {"date_of_birth": "1985-05-05", "social_security_number": "YYY-YY-YYYY", "employment_status": "Self-Employed", "annual_income": 70000.0, "source_of_income": "Business"}
    application_financial_info = {"annual_income": 70000.0, "source_of_income": "Business"}
    application_comments = {"decision": "Approved by automated system"}

    application_data = models.CreditCardApplication(
        user_id=applicant_data.user_id,
        product_id=product_data.product_id,
        personal_info=application_personal_info, # Pass as dict
        financial_info=application_financial_info, # Pass as dict
        status="Approved",
        comments=application_comments # Pass as dict
    )
    db_session.add(application_data)
    db_session.commit()
    db_session.refresh(application_data)

    response = client.get(f"/api/v1/applications/{application_data.application_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == application_data.application_id
    assert data["status"] == "Approved"
    assert data["personal_info"] == application_personal_info
    assert data["financial_info"] == application_financial_info
    assert data["comments"] == application_comments

def test_update_application_status(client: TestClient, db_session: Session):
    # Create a product
    product_data = models.CreditCardProduct(
        name="Update Status Card",
        description="Desc",
        apr=16.0,
        annual_charges=0.0,
        credit_limit_min=3000.0,
        credit_limit_max=15000.0,
        rewards_description="Cash",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    # Create an applicant
    applicant_data = models.Applicant(
        first_name="Updater",
        last_name="Man",
        email="updater.man@example.com",
        phone_number="777-888-9999",
        address={"street": "303 Cedar", "city": "City", "state": "FL", "zip_code": "33001", "country": "USA"}, # Pass as dict
        authentication_credentials="hashed_updater_man"
    )
    db_session.add(applicant_data)
    db_session.commit()
    db_session.refresh(applicant_data)

    # Create an application directly in DB
    application_personal_info = {"date_of_birth": "1970-10-10", "social_security_number": "ZZZ-ZZ-ZZZZ", "employment_status": "Retired", "annual_income": 40000.0, "source_of_income": "Pension"}
    application_financial_info = {"annual_income": 40000.0, "source_of_income": "Pension"}
    application_comments = {"initial": "Submitted"}

    application_data = models.CreditCardApplication(
        user_id=applicant_data.user_id,
        product_id=product_data.product_id,
        personal_info=application_personal_info, # Pass as dict
        financial_info=application_financial_info, # Pass as dict
        status="Pending Review",
        comments=application_comments # Pass as dict
    )
    db_session.add(application_data)
    db_session.commit()
    db_session.refresh(application_data)

    update_payload = {"status": "Declined", "comments": {"reason": "Credit score too low"}}
    response = client.put(f"/api/v1/applications/{application_data.application_id}/status", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Declined"
    assert data["comments"] == {"reason": "Credit score too low"}
    assert data["personal_info"] == application_personal_info
    assert data["financial_info"] == application_financial_info

def test_get_applications_for_user(client: TestClient, db_session: Session):
    # Create an applicant
    applicant_data = models.Applicant(
        first_name="Multi",
        last_name="App",
        email="multi.app@example.com",
        phone_number="999-888-7777",
        address={"street": "404 Lane", "city": "Metro", "state": "WA", "zip_code": "98101", "country": "USA"}, # Pass as dict
        authentication_credentials="hashed_multi_app"
    )
    db_session.add(applicant_data)
    db_session.commit()
    db_session.refresh(applicant_data)

    # Create two products
    product_data_1 = models.CreditCardProduct(
        name="Product A", description="Desc A", apr=10.0, annual_charges=0.0, credit_limit_min=100.0, credit_limit_max=1000.0, rewards_description="None", is_active=True
    )
    product_data_2 = models.CreditCardProduct(
        name="Product B", description="Desc B", apr=12.0, annual_charges=10.0, credit_limit_min=200.0, credit_limit_max=2000.0, rewards_description="Points", is_active=True
    )
    db_session.add_all([product_data_1, product_data_2])
    db_session.commit()
    db_session.refresh(product_data_1)
    db_session.refresh(product_data_2)

    # Create two applications for the same user
    app1_personal_info = {"date_of_birth": "1995-01-01", "social_security_number": "AAA-AA-AAAA", "employment_status": "Student", "annual_income": 10000.0, "source_of_income": "Allowance"}
    app1_financial_info = {"annual_income": 10000.0, "source_of_income": "Allowance"}
    app2_personal_info = {"date_of_birth": "1996-02-02", "social_security_number": "BBB-BB-BBBB", "employment_status": "Student", "annual_income": 12000.0, "source_of_income": "Part-time Job"}
    app2_financial_info = {"annual_income": 12000.0, "source_of_income": "Part-time Job"}

    application_data_1 = models.CreditCardApplication(
        user_id=applicant_data.user_id,
        product_id=product_data_1.product_id,
        personal_info=app1_personal_info, # Pass as dict
        financial_info=app1_financial_info, # Pass as dict
        status="Pending Review"
    )
    application_data_2 = models.CreditCardApplication(
        user_id=applicant_data.user_id,
        product_id=product_data_2.product_id,
        personal_info=app2_personal_info, # Pass as dict
        financial_info=app2_financial_info, # Pass as dict
        status="Approved"
    )
    db_session.add_all([application_data_1, application_data_2])
    db_session.commit()
    db_session.refresh(application_data_1)
    db_session.refresh(application_data_2)

    response = client.get(f"/api/v1/applicants/{applicant_data.user_id}/applications/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(app["product_id"] == product_data_1.product_id for app in data)
    assert any(app["product_id"] == product_data_2.product_id for app in data)
    assert data[0]["personal_info"] == app1_personal_info or data[1]["personal_info"] == app1_personal_info
    assert data[0]["financial_info"] == app1_financial_info or data[1]["financial_info"] == app1_financial_info
