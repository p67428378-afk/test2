from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app import models

def test_create_application(client: TestClient, db_session: Session):
    # Create a product and applicant first for foreign key references
    product = models.CreditCardProduct(
        name="Test Product for App",
        description="Test Description",
        apr=10.0,
        annual_charges=0.0,
        credit_limit_min=1000.0,
        credit_limit_max=5000.0,
        rewards_description="None",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    product_id = product.product_id # Extract ID immediately

    applicant = models.Applicant(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        phone_number="123-456-7890",
        address="123 Test St",
        authentication_credentials="hashed_password",
    )
    db_session.add(applicant)
    db_session.commit()
    db_session.refresh(applicant)
    user_id = applicant.user_id # Extract ID immediately

    response = client.post(
        "/applications/",
        json={
            "user_id": user_id,
            "product_id": product_id,
            "personal_info": "{\"dob\": \"1990-01-01\"}",
            "financial_info": "{\"income\": 50000}",
            "status": "Pending Review",
            "comments": "Initial application",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["product_id"] == product_id
    assert "application_id" in data

def test_read_applications(client: TestClient, db_session: Session):
    product = models.CreditCardProduct(
        name="Test Product 2",
        description="Test Description 2",
        apr=12.0,
        annual_charges=10.0,
        credit_limit_min=2000.0,
        credit_limit_max=7000.0,
        rewards_description="Points",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    product_id = product.product_id # Extract ID immediately

    applicant = models.Applicant(
        first_name="Jane",
        last_name="Smith",
        email="jane.smith@example.com",
        phone_number="098-765-4321",
        address="456 Another Ave",
        authentication_credentials="another_hashed_password",
    )
    db_session.add(applicant)
    db_session.commit()
    db_session.refresh(applicant)
    user_id = applicant.user_id # Extract ID immediately

    application = models.CreditCardApplication(
        user_id=user_id,
        product_id=product_id,
        personal_info="{\"dob\": \"1985-05-10\"}",
        financial_info="{\"income\": 75000}",
        status="Approved",
        comments="Approved by system",
    )
    db_session.add(application)
    db_session.commit()
    db_session.refresh(application)

    response = client.get("/applications/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert any(app["user_id"] == user_id for app in response.json())

def test_read_single_application(client: TestClient, db_session: Session):
    product = models.CreditCardProduct(
        name="Test Product 3",
        description="Test Description 3",
        apr=15.0,
        annual_charges=20.0,
        credit_limit_min=3000.0,
        credit_limit_max=8000.0,
        rewards_description="Miles",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    product_id = product.product_id # Extract ID immediately

    applicant = models.Applicant(
        first_name="Peter",
        last_name="Jones",
        email="peter.jones@example.com",
        phone_number="111-222-3333",
        address="789 Pine St",
        authentication_credentials="yet_another_hashed_password",
    )
    db_session.add(applicant)
    db_session.commit()
    db_session.refresh(applicant)
    user_id = applicant.user_id # Extract ID immediately

    application = models.CreditCardApplication(
        user_id=user_id,
        product_id=product_id,
        personal_info="{\"dob\": \"1970-11-20\"}",
        financial_info="{\"income\": 100000}",
        status="Declined",
        comments="Credit score too low",
    )
    db_session.add(application)
    db_session.commit()
    db_session.refresh(application)

    response = client.get(f"/applications/{application.application_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == application.application_id
    assert data["status"] == "Declined"

def test_read_nonexistent_application(client: TestClient):
    response = client.get("/applications/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}
