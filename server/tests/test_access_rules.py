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

def test_create_and_get_access_rules():
    db = TestingSessionLocal()
    
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
    
    # Create an access rule to close the trail
    response = client.post(
        "/api/v1/access_rules",
        json={
            "trail_id": str(trail_id),
            "is_closed": True,
            "reason": "Seasonal migration closure"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["is_closed"] is True
    assert data["reason"] == "Seasonal migration closure"
    
    # Check that trail status was updated to Closed
    db.refresh(db_trail)
    assert db_trail.status == "Closed"
    
    # Get all access rules
    response = client.get("/api/v1/access_rules")
    assert response.status_code == 200
    rules = response.json()
    assert len(rules) >= 1
    assert any(r["trail_name"] == trail_name for r in rules)
    
    # Set trail status to Hazardous
    db_trail.status = "Hazardous"
    db.commit()
    
    # Try to open the trail (is_closed=False) when it is Hazardous -> should fail with 400
    response = client.post(
        "/api/v1/access_rules",
        json={
            "trail_id": str(trail_id),
            "is_closed": False,
            "reason": "Try to open"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Cannot open a trail marked as Hazardous"
    
    # Test 404 for non-existent trail
    response = client.post(
        "/api/v1/access_rules",
        json={
            "trail_id": str(uuid.uuid4()),
            "is_closed": True
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Trail not found"
    
    db.close()
