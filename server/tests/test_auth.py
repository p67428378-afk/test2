"""
Module: test_auth
Purpose: Unit and integration tests for authentication endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import get_db
from server import models
import os

# Use DATABASE_URL from env or fallback to in-memory SQLite
DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    models.Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    models.Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_user_registration_success():
    # AC: Users can register with unique login_id and mobile_number
    response = client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "newuser@example.com",
            "mobile_number": "0987654321",
            "password": "securepassword",
            "security_question": "What is your pet's name?",
            "security_answer": "buddy",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["login_id"] == "newuser@example.com"
    assert data["mobile_number"] == "0987654321"
    assert "id" in data


def test_user_registration_duplicate_login():
    # AC: Username or mobile number already registered returns 400
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "dup@example.com",
            "mobile_number": "1111111111",
            "password": "password",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    # Try to register duplicate login_id
    response = client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "dup@example.com",
            "mobile_number": "2222222222",
            "password": "password",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username or mobile number already registered"


def test_user_registration_duplicate_mobile():
    # AC: Username or mobile number already registered returns 400
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "user1@example.com",
            "mobile_number": "1111111111",
            "password": "password",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    # Try to register duplicate mobile_number
    response = client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "user2@example.com",
            "mobile_number": "1111111111",
            "password": "password",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username or mobile number already registered"


def test_user_login_success():
    # AC: Log in and get a JWT token
    client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "login@example.com",
            "mobile_number": "3333333333",
            "password": "password123",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"login_id": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_login_invalid_credentials():
    # AC: Invalid credentials returns 401
    response = client.post(
        "/api/v1/auth/login",
        json={"login_id": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_get_current_user_profile():
    # AC: Get current user profile
    client.post(
        "/api/v1/auth/register",
        json={
            "login_id": "me@example.com",
            "mobile_number": "4444444444",
            "password": "password123",
            "security_question": "Q",
            "security_answer": "A",
        },
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "me@example.com", "password": "password123"},
    )
    token = login_resp.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["login_id"] == "me@example.com"
    assert data["mobile_number"] == "4444444444"


def test_get_current_user_unauthenticated():
    # AC: Not authenticated returns 401
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
