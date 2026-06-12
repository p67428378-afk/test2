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

def test_create_and_get_trail_reports():
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
    
    # Create a trail
    trail_id = uuid.uuid4()
    trail_name = f"Trail-{uuid.uuid4()}"
    db_trail = models.Trail(
        id=trail_id,
        name=trail_name,
        status="Open"
    )
    db.add(db_trail)
    db.commit()
    
    # Submit a report
    response = client.post(
        "/api/v1/trail_reports",
        json={
            "trail_id": str(trail_id),
            "user_id": str(user_id),
            "condition": "Needs Maintenance",
            "notes": "Fallen tree",
            "media_url": "http://example.com/image.jpg"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["condition"] == "Needs Maintenance"
    assert data["notes"] == "Fallen tree"
    
    # Check that trail status was updated
    db.refresh(db_trail)
    assert db_trail.status == "Needs Maintenance"
    
    # Get all reports
    response = client.get("/api/v1/trail_reports")
    assert response.status_code == 200
    reports = response.json()
    assert len(reports) >= 1
    assert any(r["trail_name"] == trail_name for r in reports)
    
    # Test 404 for non-existent trail
    response = client.post(
        "/api/v1/trail_reports",
        json={
            "trail_id": str(uuid.uuid4()),
            "user_id": str(user_id),
            "condition": "Open"
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Trail not found"

    # Test 404 for non-existent user
    response = client.post(
        "/api/v1/trail_reports",
        json={
            "trail_id": str(trail_id),
            "user_id": str(uuid.uuid4()),
            "condition": "Open"
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"
    
    db.close()
