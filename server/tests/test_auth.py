import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
        yield c
    app.dependency_overrides.clear()


def test_signup_success(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "name": "New User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert data["name"] == "New User"


def test_signup_duplicate_email(client):
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "dup@example.com", "password": "password123"},
    )
    # Second signup with same email
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "dup@example.com", "password": "password123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client):
    # Signup first
    client.post(
        "/api/v1/auth/signup",
        json={"email": "login@example.com", "password": "password123"},
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_incorrect_password(client):
    client.post(
        "/api/v1/auth/signup",
        json={"email": "login2@example.com", "password": "password123"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login2@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
