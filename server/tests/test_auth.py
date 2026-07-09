import pytest
from fastapi.testclient import TestClient
from server.main import app


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    with TestClient(app) as client:
        yield client


@pytest.fixture
def client():
    return TestClient(app)


def test_register_and_login(client):
    # Register a new user
    register_data = {
        "email": "newuser@example.com",
        "name": "New User",
        "password": "password123",
    }
    response = client.post("/api/v1/auth/register", json=register_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"
    assert "id" in data

    # Try to register again with same email
    response = client.post("/api/v1/auth/register", json=register_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

    # Login
    login_data = {"email": "newuser@example.com", "password": "password123"}
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Login with invalid credentials
    login_data["password"] = "wrongpassword"
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
