import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

from server.app.database import Base, get_db
from server.app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_funerals.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)

def test_create_funeral(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    # Create a body first
    body_response = client.post(
        "/api/v1/bodies",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "date_of_death": "2026-05-15",
            "intake_date": "2026-05-16T10:00:00",
            "location": "Refrigeration Room A",
            "status": "intake"
        }
    )
    body_id = body_response.json()["body_id"]

    # Create funeral
    funeral_response = client.post(
        "/api/v1/funerals",
        json={
            "body_id": body_id,
            "service_type": "burial",
            "service_date": "2026-05-20T11:00:00",
            "notes": "Family requested quiet service",
            "assigned_resources": "Chapel A, Hearse 1",
            "status": "scheduled"
        }
    )
    assert funeral_response.status_code == 201
    data = funeral_response.json()
    assert data["service_type"] == "burial"
    assert data["body_id"] == body_id
    assert "funeral_id" in data

def test_list_funerals(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    # Create body and funeral
    body_response = client.post(
        "/api/v1/bodies",
        json={
            "first_name": "Jane",
            "last_name": "Smith",
            "date_of_death": "2026-05-14",
            "intake_date": "2026-05-15T09:00:00",
            "location": "Refrigeration Room B",
            "status": "intake"
        }
    )
    body_id = body_response.json()["body_id"]

    client.post(
        "/api/v1/funerals",
        json={
            "body_id": body_id,
            "service_type": "cremation",
            "service_date": "2026-05-19T14:00:00",
            "notes": "No special requests",
            "assigned_resources": "Crematory Room 1",
            "status": "scheduled"
        }
    )

    response = client.get("/api/v1/funerals")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["service_type"] == "cremation"

def test_get_funeral_not_found(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/funerals/{random_uuid}")
    assert response.status_code == 404

def test_update_funeral(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    # Create body and funeral
    body_response = client.post(
        "/api/v1/bodies",
        json={
            "first_name": "Alice",
            "last_name": "Brown",
            "date_of_death": "2026-05-13",
            "intake_date": "2026-05-14T08:00:00",
            "location": "Prep Room 1",
            "status": "intake"
        }
    )
    body_id = body_response.json()["body_id"]

    funeral_response = client.post(
        "/api/v1/funerals",
        json={
            "body_id": body_id,
            "service_type": "burial",
            "service_date": "2026-05-20T11:00:00",
            "notes": "Family requested quiet service",
            "assigned_resources": "Chapel A, Hearse 1",
            "status": "scheduled"
        }
    )
    funeral_id = funeral_response.json()["funeral_id"]

    # Update funeral status
    update_response = client.put(
        f"/api/v1/funerals/{funeral_id}",
        json={
            "status": "completed",
            "notes": "Service completed successfully"
        }
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["status"] == "completed"
    assert data["notes"] == "Service completed successfully"
