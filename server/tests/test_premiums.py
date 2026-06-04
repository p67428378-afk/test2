
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.models.policy import Base
from server.api.v1.endpoints.premiums import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
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

def test_calculate_premium():
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"base_rate": 500, "ncb_percentage": 20, "vehicle_multiplier": 1.2},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_premium"] == 480.0
    assert "id" in data
