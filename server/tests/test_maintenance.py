import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from datetime import datetime, timedelta

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

def test_get_maintenance_orders():
    response = client.get("/api/v1/maintenance")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert any(m["priority"] == "high" for m in data)

def test_create_maintenance_order():
    # Get pipelines to find an ID
    response = client.get("/api/v1/pipelines")
    pipelines = response.json()
    p1_id = pipelines[0]["id"]
    
    due_date = (datetime.utcnow() + timedelta(days=2)).isoformat()
    
    response_create = client.post(
        "/api/v1/maintenance",
        json={
            "pipeline_id": p1_id,
            "description": "Fix valve in Sector 4B",
            "assigned_to": "Crew Gamma",
            "priority": "medium",
            "due_date": due_date
        }
    )
    assert response_create.status_code == 200
    data = response_create.json()
    assert data["description"] == "Fix valve in Sector 4B"
    assert data["status"] == "pending"

def test_create_maintenance_order_invalid_pipeline():
    fake_id = "00000000-0000-0000-0000-000000000000"
    due_date = (datetime.utcnow() + timedelta(days=2)).isoformat()
    
    response_create = client.post(
        "/api/v1/maintenance",
        json={
            "pipeline_id": fake_id,
            "description": "Fix valve in Sector 4B",
            "assigned_to": "Crew Gamma",
            "priority": "medium",
            "due_date": due_date
        }
    )
    assert response_create.status_code == 404
    assert response_create.json()["detail"] == "Pipeline not found"

def test_create_maintenance_order_invalid_input():
    response = client.get("/api/v1/pipelines")
    pipelines = response.json()
    p1_id = pipelines[0]["id"]
    due_date = (datetime.utcnow() + timedelta(days=2)).isoformat()
    
    response_create = client.post(
        "/api/v1/maintenance",
        json={
            "pipeline_id": p1_id,
            "description": "   ",
            "assigned_to": "Crew Gamma",
            "priority": "medium",
            "due_date": due_date
        }
    )
    assert response_create.status_code == 400
    assert response_create.json()["detail"] == "Invalid input data"

def test_update_maintenance_order():
    response = client.get("/api/v1/maintenance")
    orders = response.json()
    order_id = orders[0]["id"]
    
    response_update = client.put(
        f"/api/v1/maintenance/{order_id}",
        json={
            "status": "completed",
            "priority": "low"
        }
    )
    assert response_update.status_code == 200
    data = response_update.json()
    assert data["status"] == "completed"
    assert data["priority"] == "low"

def test_update_maintenance_order_not_found():
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.put(
        f"/api/v1/maintenance/{fake_id}",
        json={
            "status": "completed"
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Work order not found"
