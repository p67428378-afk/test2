"""Unit and integration tests for Authentication endpoints."""


def test_login_seeded_customer(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "Customer"
    assert data["user"]["email"] == "test@example.com"


def test_login_seeded_admin(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "Admin"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_signup_new_user(client):
    payload = {
        "email": "newcustomer@example.com",
        "password": "securepassword123",
        "full_name": "New Customer",
        "role": "Customer",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newcustomer@example.com"
    assert data["full_name"] == "New Customer"
    assert data["is_active"] is True


def test_signup_duplicate_email(client):
    payload = {
        "email": "test@example.com",
        "password": "securepassword123",
        "full_name": "Duplicate User",
        "role": "Customer",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


def test_get_current_user_me(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_res.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Samantha Reed"


def test_get_current_user_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
