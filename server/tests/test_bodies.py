import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date
import uuid

from server.app.database import Base, get_db
from server.app.main import app
from server.app.config import settings

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_bodies.db"
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

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield client
    app.dependency_overrides.clear()

def test_create_body(db):
    # We can use TestClient directly
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    response = client.post(
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
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["location"] == "Refrigeration Room A"
    assert "body_id" in data

def test_list_bodies(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    # Create a body first
    client.post(
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

    response = client.get("/api/v1/bodies")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["first_name"] == "Jane"

def test_get_body_not_found(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/bodies/{random_uuid}")
    assert response.status_code == 404

def test_update_body(db):
    client = TestClient(app)
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db

    # Create a body
    create_response = client.post(
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
    body_id = create_response.json()["body_id"]

    # Update status and location
    update_response = client.put(
        f"/api/v1/bodies/{body_id}",
        json={
            "status": "preparation",
            "location": "Prep Room 2"
        }
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["status"] == "preparation"
    assert data["location"] == "Prep Room 2"
