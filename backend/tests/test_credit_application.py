from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.schemas.credit_application import CreditApplicationCreate


def test_create_credit_application(client: TestClient, db_session: Session):
    application_data = {
        "full_name": "John Doe",
        "contact_information": "john.doe@example.com",
        "date_of_birth": "1990-01-01",
        "address": "123 Main St",
        "employment_status": "Employed",
        "annual_income": 75000.0,
        "existing_credit_obligations": "Mortgage, Car Loan"
    }
    response = client.post("/api/v1/applications", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == application_data["full_name"]
    assert data["contact_information"] == application_data["contact_information"]
    assert data["status"] == "Submitted"

def test_get_credit_card_tiers(client: TestClient):
    response = client.get("/api/v1/credit-card-tiers?credit_score=720")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]
    assert "apr" in data[0]
    assert "credit_limit" in data[0]
    assert "rewards_program" in data[0]

def test_select_credit_card_tier(client: TestClient, db_session: Session):
    # First, create an application
    application_data = {
        "full_name": "Jane Doe",
        "contact_information": "jane.doe@example.com",
        "date_of_birth": "1992-05-10",
        "address": "456 Oak Ave",
        "employment_status": "Self-Employed",
        "annual_income": 120000.0
    }
    response = client.post("/api/v1/applications", json=application_data)
    assert response.status_code == 200
    application = response.json()
    application_id = application["id"]

    # Then, select a tier
    tier_selection = {"selected_credit_card_tier": "Platinum"}
    response = client.post(f"/api/v1/applications/{application_id}/select-tier", json=tier_selection)
    assert response.status_code == 200
    data = response.json()
    assert data["selected_credit_card_tier"] == "Platinum"
    assert data["status"] == "In Review"
