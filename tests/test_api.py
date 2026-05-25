from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.schemas.application import ApplicationCreate
from app.schemas.credit_card import CreditCardCreate


def test_create_application(client: TestClient, db_session: Session):
    application_in = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "phone_number": "1234567890",
        "address": "123 Main St",
        "date_of_birth": "1990-01-01",
        "annual_income": 50000,
        "employment_status": "Employed",
    }
    response = client.post("/api/v1/applications/", json=application_in)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == application_in["email"]
    assert "id" in data

def test_get_application_status_eligible(client: TestClient, db_session: Session):
    # Create a credit card product
    credit_card_in = CreditCardCreate(
        product_name="Test Card",
        description="A test card",
        interest_rate=12.5,
        annual_fee=100,
        credit_limit_range="$5000-$10000",
        min_credit_score=600,
        min_income=40000,
        image_url="http://example.com/image.png"
    )
    crud.credit_card.create(db_session, obj_in=credit_card_in)

    # Create an application
    application_in = ApplicationCreate(
        first_name="Jane",
        last_name="Doe",
        email="janedoe@example.com",
        phone_number="1234567890",
        address="123 Main St",
        date_of_birth="1990-01-01",
        annual_income=70000,
        employment_status="Employed",
    )
    application = crud.application.create(db_session, obj_in=application_in)

    response = client.get(f"/api/v1/applications/{application.id}/status")
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Eligible"
    assert data["ineligibility_reason"] is None
    assert len(data["eligible_products"]) > 0

def test_get_application_status_ineligible_score(client: TestClient, db_session: Session, mocker):
    application_in = ApplicationCreate(
        first_name="Sam",
        last_name="Smith",
        email="samsmith@example.com",
        phone_number="1234567890",
        address="123 Main St",
        date_of_birth="1990-01-01",
        annual_income=70000,
        employment_status="Employed",
    )
    application = crud.application.create(db_session, obj_in=application_in)

    mocker.patch("app.services.eligibility.get_credit_score", return_value=650.0)

    response = client.get(f"/api/v1/applications/{application.id}/status")
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Ineligible"
    assert data["ineligibility_reason"] == "Credit score is too low."
    assert len(data["eligible_products"]) == 0

def test_get_application_status_ineligible_income(client: TestClient, db_session: Session, mocker):
    application_in = ApplicationCreate(
        first_name="Peter",
        last_name="Jones",
        email="peterjones@example.com",
        phone_number="1234567890",
        address="123 Main St",
        date_of_birth="1990-01-01",
        annual_income=20000,
        employment_status="Employed",
    )
    application = crud.application.create(db_session, obj_in=application_in)
    
    mocker.patch("app.services.eligibility.get_credit_score", return_value=750.0)

    response = client.get(f"/api/v1/applications/{application.id}/status")
    assert response.status_code == 200
    data = response.json()
    assert data["eligibility_status"] == "Ineligible"
    assert data["ineligibility_reason"] == "Annual income is too low."
    assert len(data["eligible_products"]) == 0
