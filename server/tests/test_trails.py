import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

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

def test_create_and_get_trails():
    # Create a unique trail name to avoid conflicts
    import uuid
    trail_name = f"Trail-{uuid.uuid4()}"
    
    # Create trail
    response = client.post(
        "/api/v1/trails",
        json={"name": trail_name, "status": "Open"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == trail_name
    assert data["status"] == "Open"
    assert "id" in data

    # Create duplicate trail
    response = client.post(
        "/api/v1/trails",
        json={"name": trail_name, "status": "Open"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Trail name already exists"

    # Get all trails
    response = client.get("/api/v1/trails")
    assert response.status_code == 200
    trails = response.json()
    assert len(trails) >= 1
    assert any(t["name"] == trail_name for t in trails)
