import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import os

# Use the environment's DATABASE_URL if provided, otherwise fallback to in-memory
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    # Re-create tables for each test to ensure clean state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def auth_headers():
    # Register and login to get token
    username = "cred_test@example.com"
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "master_password": "securepassword123"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"username": username, "master_password": "securepassword123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_credential_crud(auth_headers):
    # Create credential
    response = client.post(
        "/api/v1/credentials",
        headers=auth_headers,
        json={
            "title": "Google",
            "username": "encrypted_user_base64",
            "password": "encrypted_password_base64",
            "url": "encrypted_url_base64",
            "notes": "encrypted_notes_base64",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Google"
    assert data["username"] == "encrypted_user_base64"
    cred_id = data["id"]

    # Get credentials
    response = client.get("/api/v1/credentials", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Search credentials
    response = client.get("/api/v1/credentials?search=Google", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1

    # Update credential
    response = client.put(
        f"/api/v1/credentials/{cred_id}",
        headers=auth_headers,
        json={"title": "Google Updated"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Google Updated"

    # Delete credential
    response = client.delete(f"/api/v1/credentials/{cred_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["success"] is True

    # Get deleted credential should return empty list or not include it
    response = client.get("/api/v1/credentials", headers=auth_headers)
    assert all(item["id"] != cred_id for item in response.json())
