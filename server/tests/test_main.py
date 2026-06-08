from fastapi.testclient import TestClient


def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Films Dashboard System"}


def test_register(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "string"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_login(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "string"},
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "string"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_read_users_me_unauthorized(client: TestClient):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401


def test_read_users_me_authorized(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "string"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "string"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
