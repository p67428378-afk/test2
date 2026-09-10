from starlette.testclient import TestClient


def test_seeded_test_user_login(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"


def test_seeded_admin_user_login(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@example.com"


def test_register_user_success(client: TestClient):
    payload = {
        "email": "newuser@example.com",
        "password": "Password123!",
        "full_name": "New Developer",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New Developer"
    assert data["is_active"] is True
    assert "id" in data


def test_register_duplicate_email(client: TestClient):
    payload = {
        "email": "test@example.com",
        "password": "Password123!",
        "full_name": "Duplicate User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_invalid_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 400
    assert "incorrect email or password" in response.json()["detail"].lower()


def test_login_nonexistent_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "unknown@example.com", "password": "anyPassword"},
    )
    assert response.status_code == 400
    assert "incorrect email or password" in response.json()["detail"].lower()


def test_get_me_authenticated(client: TestClient):
    # Login first
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_resp.json()["access_token"]

    # Request /me with Bearer token
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["is_active"] is True


def test_get_me_unauthorized(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
