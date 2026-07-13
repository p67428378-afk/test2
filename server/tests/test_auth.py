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


def test_register_and_login():
    # Register a new user
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "test_user_auth@example.com",
            "master_password": "securepassword123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "test_user_auth@example.com"
    assert "id" in data

    # Register duplicate user should fail
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "test_user_auth@example.com",
            "master_password": "securepassword123",
        },
    )
    assert response.status_code == 400

    # Register with short password should fail
    response = client.post(
        "/api/v1/auth/register",
        json={"username": "short_pw@example.com", "master_password": "123"},
    )
    assert response.status_code == 400

    # Login successfully
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "test_user_auth@example.com",
            "master_password": "securepassword123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Login with invalid password
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "test_user_auth@example.com",
            "master_password": "wrongpassword",
        },
    )
    assert response.status_code == 401


def test_account_lockout():
    # Register a user for lockout testing
    username = "lockout_test@example.com"
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "master_password": "securepassword123"},
    )

    # Fail login 5 times
    for _ in range(5):
        response = client.post(
            "/api/v1/auth/login",
            json={"username": username, "master_password": "wrongpassword"},
        )
        assert response.status_code == 401

    # 6th attempt should be locked out (403)
    response = client.post(
        "/api/v1/auth/login",
        json={"username": username, "master_password": "wrongpassword"},
    )
    assert response.status_code == 403
    assert "locked" in response.json()["detail"]
