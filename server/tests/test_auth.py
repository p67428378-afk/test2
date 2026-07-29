from fastapi.testclient import TestClient


def test_login_success_admin(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_success_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_failure_invalid_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_failure_nonexistent_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "nonexistent@example.com", "password": "password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"
