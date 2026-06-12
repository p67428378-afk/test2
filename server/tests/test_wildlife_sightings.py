import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

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

def test_create_and_get_wildlife_sightings():
    db = TestingSessionLocal()
    
    # Create a user
    user_id = uuid.uuid4()
    login_id = f"user-{uuid.uuid4()}"
    db_user = models.User(
        id=user_id,
        login_id=login_id,
        mobile_number=f"num-{uuid.uuid4()}"[:20],
        hashed_password="hash",
        security_question="q",
        security_answer_hash="a"
    )
    db.add(db_user)
    db.commit()
    
    # Log a sighting
    response = client.post(
        "/api/v1/wildlife_sightings",
        json={
            "user_id": str(user_id),
            "species": "Grizzly Bear",
            "count": 2,
            "location": "Near Whispering Pines",
            "notes": "Two adult bears"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["species"] == "Grizzly Bear"
    assert data["count"] == 2
    
    # Get all sightings
    response = client.get("/api/v1/wildlife_sightings")
    assert response.status_code == 200
    sightings = response.json()
    assert len(sightings) >= 1
    assert any(s["species"] == "Grizzly Bear" for s in sightings)
    
    # Test 404 for non-existent user
    response = client.post(
        "/api/v1/wildlife_sightings",
        json={
            "user_id": str(uuid.uuid4()),
            "species": "Grizzly Bear",
            "count": 2,
            "location": "Near Whispering Pines"
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"
    
    db.close()
