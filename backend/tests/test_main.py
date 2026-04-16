from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import crud, schemas

def test_create_credit_card(client: TestClient, db_session: Session):
    response = client.post(
        "/api/credit-cards/",
        json={"name": "Test Card", "features": ["feat1", "feat2"], "benefits": ["ben1", "ben2"], "eligibility_criteria": {"min_score": 700}, "apr": 12.5, "annual_fee": 100, "issuer": "Test Bank", "image_url": "http://example.com/img.png"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Card"
    assert data["issuer"] == "Test Bank"

def test_read_credit_cards(client: TestClient, db_session: Session):
    # Create a card to read
    crud.create_credit_card(db_session, schemas.CreditCardCreate(name="Test Card 2", features=[], benefits=[], eligibility_criteria={}, apr=10.0, annual_fee=50, issuer="Test Bank 2", image_url=""))

    response = client.get("/api/credit-cards/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Test Card 2"

def test_create_application(client: TestClient, db_session: Session):
    # Create a card and applicant first
    card = crud.create_credit_card(db_session, schemas.CreditCardCreate(name="Test Card 3", features=[], benefits=[], eligibility_criteria={}, apr=10.0, annual_fee=50, issuer="Test Bank 3", image_url=""))
    applicant = crud.create_applicant(db_session, schemas.ApplicantCreate(full_name="Test User", address={}, phone_number="123", email_address="test@test.com", credit_score=750, annual_income=100000, employer_name="test", employer_address={}, job_title="dev", employment_start_date="2022-01-01"))

    response = client.post(
        f"/api/applicants/{applicant.id}/applications/",
        json={"card_id": card.id, "submission_date": "2024-01-01", "status": "submitted"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "submitted"
    assert data["applicant_id"] == applicant.id
