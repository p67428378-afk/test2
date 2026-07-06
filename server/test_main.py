import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.models import User, User2FAMethod, AuditLog

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"

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


@pytest.fixture(autouse=True)
def run_around_tests():
    # Clear database before each test
    db = TestingSessionLocal()
    db.query(User2FAMethod).delete()
    db.query(AuditLog).delete()
    db.query(User).delete()
    db.commit()
    db.close()
    yield


def test_register_success():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "Password123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "john@example.com"
    assert data["full_name"] == "John Doe"
    assert data["is_active"] is False


def test_register_duplicate_email():
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "Password123!",
        },
    )
    # Register second user with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Jane Doe",
            "email": "john@example.com",
            "phone_number": "0987654321",
            "date_of_birth": "1992-02-02",
            "ssn": "987654321",
            "password": "Password123!",
        },
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"


def test_register_weak_password():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "weak",
        },
    )
    # FastAPI returns 422 for validation errors, but our custom strength check raises 400
    assert response.status_code in (400, 422)


def test_login_and_2fa_flow():
    # 1. Register
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "Password123!",
        },
    )

    # 2. Login (Step 1)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "john@example.com", "password": "Password123!"},
    )
    assert response.status_code == 200
    login_data = response.json()
    assert login_data["requires_2fa"] is True
    temp_token = login_data["temp_token"]
    user_id = login_data["user_id"]

    # 3. Setup 2FA
    response = client.post(
        "/api/v1/auth/2fa/setup", json={"user_id": user_id, "method_type": "APP"}
    )
    assert response.status_code == 200
    setup_data = response.json()
    assert "secret" in setup_data

    # 4. Verify 2FA (Step 2)
    response = client.post(
        "/api/v1/auth/login/2fa",
        json={"user_id": user_id, "temp_token": temp_token, "code": "123456"},
    )
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"


def test_brute_force_lockout():
    # Register
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "Password123!",
        },
    )

    # 5 failed login attempts
    for _ in range(5):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "john@example.com", "password": "WrongPassword123!"},
        )
        assert response.status_code == 401

    # 6th attempt should be locked out
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "john@example.com", "password": "Password123!"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Account locked due to too many failed attempts"


def test_account_recovery():
    # Register
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "Password123!",
        },
    )

    # Recover account with new password
    response = client.post(
        "/api/v1/auth/recovery",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "date_of_birth": "1990-01-01",
            "ssn": "123456789",
            "password": "NewPassword123!",
        },
    )
    assert response.status_code == 200
    assert (
        response.json()["detail"]
        == "Account recovered successfully. Please log in and set up 2FA again."
    )

    # Login with new password
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "john@example.com", "password": "NewPassword123!"},
    )
    assert response.status_code == 200
    assert response.json()["requires_2fa"] is True
