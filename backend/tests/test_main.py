import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from backend.main import app
from backend.database import Base, get_db
from backend import models

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a new database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create a new FastAPI TestClient for each test."""
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

def test_create_credit_card_offer(client):
    response = client.post(
        "/api/offers/",
        json={"card_name": "Test Card", "features": "Test Features", "benefits": "Test Benefits", "eligibility_criteria": "Test Criteria"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["card_name"] == "Test Card"
    assert "id" in data

def test_get_credit_card_offers(client):
    response = client.get("/api/offers/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_create_application(client):
    # First, create an offer to link the application to
    offer_response = client.post(
        "/api/offers/",
        json={"card_name": "Application Test Card", "features": "Test Features", "benefits": "Test Benefits", "eligibility_criteria": "Test Criteria"},
    )
    offer_id = offer_response.json()["id"]

    application_data = {
        "submission_date": "2024-01-01",
        "applicant": {
            "name": "John Doe",
            "address": "123 Main St",
            "phone": "555-1234",
            "email": "john.doe@example.com",
            "credit_score": 750.0,
            "annual_income": 100000.0,
            "employment": {
                "employer_name": "Big Corp",
                "employer_address": "456 Market St",
                "job_title": "Software Engineer",
                "employment_start_date": "2022-01-01"
            }
        },
        "offer_id": offer_id
    }
    response = client.post("/api/applications/", json=application_data)
    assert response.status_code == 200
    data = response.json()
    assert data["applicant"]["name"] == "John Doe"
    assert data["status"] == "Pending"

def test_get_applications(client):
    response = client.get("/api/applications/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
