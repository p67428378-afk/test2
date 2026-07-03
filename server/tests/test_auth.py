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


@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
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


def test_register_and_login(client, db):
    # Register a new user
    register_payload = {
        "email": "newuser@example.com",
        "name": "New User",
        "role": "owner",
        "password": "securepassword",
    }
    response = client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data

    # Login with the registered user
    login_payload = {"username": "newuser@example.com", "password": "securepassword"}
    response = client.post("/api/v1/auth/token", json=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "owner"
    assert token_data["token_type"] == "bearer"

    # Get current user profile
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["email"] == "newuser@example.com"
    assert profile["role"] == "owner"


def test_login_invalid_credentials(client):
    login_payload = {"username": "nonexistent@example.com", "password": "wrongpassword"}
    response = client.post("/api/v1/auth/token", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
