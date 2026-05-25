
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_campaign():
    response = client.post(
        "/api/v1/campaigns/",
        json={"name": "Test Campaign", "brand_id": "Test Brand", "start_date": "2024-01-01T00:00:00", "end_date": "2024-01-31T23:59:59"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Campaign"
    assert "campaign_id" in data

def test_read_campaigns():
    response = client.get("/api/v1/campaigns/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_campaign():
    # First create a campaign to ensure one exists
    response = client.post(
        "/api/v1/campaigns/",
        json={"name": "Another Test Campaign", "brand_id": "Another Test Brand", "start_date": "2024-02-01T00:00:00", "end_date": "2024-02-28T23:59:59"},
    )
    assert response.status_code == 200
    campaign_id = response.json()["campaign_id"]

    response = client.get(f"/api/v1/campaigns/{campaign_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Another Test Campaign"
    assert data["campaign_id"] == campaign_id
