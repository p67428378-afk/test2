
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import crud, schemas

def test_get_credit_card_offerings_empty(client: TestClient):
    response = client.get("/api/credit-cards/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_credit_card_offering(client: TestClient, setup_db: Session):
    offering_data = {
        "name": "Test Card",
        "description": "A test card",
        "features": ["Feature 1", "Feature 2"],
        "benefits": ["Benefit 1", "Benefit 2"],
        "eligibility_criteria": "Everyone is eligible"
    }
    response = client.post("/api/credit-cards/", json=offering_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == offering_data["name"]
    assert "id" in data

def test_get_credit_card_offerings_with_data(client: TestClient, setup_db: Session):
    offering_data = {
        "name": "Test Card",
        "description": "A test card",
        "features": ["Feature 1", "Feature 2"],
        "benefits": ["Benefit 1", "Benefit 2"],
        "eligibility_criteria": "Everyone is eligible"
    }
    client.post("/api/credit-cards/", json=offering_data)

    response = client.get("/api/credit-cards/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == offering_data["name"]
