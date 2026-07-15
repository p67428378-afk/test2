import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import uuid

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_passwords.db"
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


@pytest.fixture
def auth_headers():
    email = f"vault_user_{uuid.uuid4().hex}@example.com"
    # Register
    client.post(
        "/api/v1/users/register",
        json={"email": email, "master_password": "vaultpassword123"},
    )
    # Login
    response = client.post(
        "/api/v1/users/login",
        json={"email": email, "master_password": "vaultpassword123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_password_entry(auth_headers):
    # Create entry
    payload = {
        "title": "My Email",
        "url": "https://mail.google.com",
        "username": "user@gmail.com",
        "password": "supersecretpassword",
    }
    response = client.post("/api/v1/passwords", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["username"] == payload["username"]
    assert data["password"] == payload["password"]
    entry_id = data["id"]

    # Get entries
    response = client.get("/api/v1/passwords", headers=auth_headers)
    assert response.status_code == 200
    entries = response.json()
    assert len(entries) > 0
    assert any(e["id"] == entry_id for e in entries)


def test_update_password_entry(auth_headers):
    # Create entry
    payload = {
        "title": "My Bank",
        "url": "https://bank.com",
        "username": "bankuser",
        "password": "bankpassword",
    }
    response = client.post("/api/v1/passwords", json=payload, headers=auth_headers)
    entry_id = response.json()["id"]

    # Update entry
    update_payload = {"password": "newbankpassword123"}
    response = client.put(
        f"/api/v1/passwords/{entry_id}", json=update_payload, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["password"] == "newbankpassword123"
    assert data["title"] == "My Bank"


def test_delete_password_entry(auth_headers):
    # Create entry
    payload = {
        "title": "Temporary Account",
        "url": "https://temp.com",
        "username": "tempuser",
        "password": "temppassword",
    }
    response = client.post("/api/v1/passwords", json=payload, headers=auth_headers)
    entry_id = response.json()["id"]

    # Delete entry
    response = client.delete(f"/api/v1/passwords/{entry_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Password entry deleted successfully"

    # Verify deletion
    response = client.get("/api/v1/passwords", headers=auth_headers)
    entries = response.json()
    assert not any(e["id"] == entry_id for e in entries)


def test_generate_password():
    payload = {
        "length": 20,
        "include_uppercase": True,
        "include_lowercase": True,
        "include_numbers": True,
        "include_symbols": True,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["password"]) == 20
