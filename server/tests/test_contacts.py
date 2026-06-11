import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

DB_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ensure tables are created in the test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Clean tables before each test
    db = TestingSessionLocal()
    try:
        db.query(models.Contact).delete()
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
    yield

def test_create_contact_success():
    response = client.post(
        "/api/v1/contacts",
        json={
            "name": "John Doe",
            "phone_number": "123-456-7890",
            "email": "john.doe@example.com"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["phone_number"] == "123-456-7890"
    assert data["email"] == "john.doe@example.com"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_create_contact_invalid_phone():
    response = client.post(
        "/api/v1/contacts",
        json={
            "name": "John Doe",
            "phone_number": "1234567890",  # Invalid format
            "email": "john.doe@example.com"
        }
    )
    assert response.status_code == 422  # FastAPI validation error

def test_create_contact_invalid_email():
    response = client.post(
        "/api/v1/contacts",
        json={
            "name": "John Doe",
            "phone_number": "123-456-7890",
            "email": "not-an-email"  # Invalid format
        }
    )
    assert response.status_code == 422  # FastAPI validation error

def test_create_contact_duplicate_phone():
    # Create first contact
    response1 = client.post(
        "/api/v1/contacts",
        json={
            "name": "John Doe",
            "phone_number": "123-456-7890",
            "email": "john.doe@example.com"
        }
    )
    assert response1.status_code == 201

    # Create second contact with same phone number
    response2 = client.post(
        "/api/v1/contacts",
        json={
            "name": "Jane Doe",
            "phone_number": "123-456-7890",
            "email": "jane.doe@example.com"
        }
    )
    assert response2.status_code == 409
    assert "phone number already exists" in response2.json()["detail"]

def test_create_contact_duplicate_email():
    # Create first contact
    response1 = client.post(
        "/api/v1/contacts",
        json={
            "name": "John Doe",
            "phone_number": "123-456-7890",
            "email": "john.doe@example.com"
        }
    )
    assert response1.status_code == 201

    # Create second contact with same email
    response2 = client.post(
        "/api/v1/contacts",
        json={
            "name": "Jane Doe",
            "phone_number": "987-654-3210",
            "email": "john.doe@example.com"
        }
    )
    assert response2.status_code == 409
    assert "email already exists" in response2.json()["detail"]

def test_get_contacts_pagination():
    # Create multiple contacts
    for i in range(5):
        client.post(
            "/api/v1/contacts",
            json={
                "name": f"Contact {i}",
                "phone_number": f"111-111-111{i}",
                "email": f"contact{i}@example.com"
            }
        )
    
    # Get first page (limit 2)
    response = client.get("/api/v1/contacts?skip=0&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Contact 0"
    assert data[1]["name"] == "Contact 1"

    # Get second page (skip 2, limit 2)
    response = client.get("/api/v1/contacts?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Contact 2"
    assert data[1]["name"] == "Contact 3"
