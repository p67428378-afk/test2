"""
Module: test_auth
Purpose: Test authentication endpoints.
"""


def test_register_user(client):
    # AC: User registration creates a new customer account
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "name": "New User",
            "password": "password123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"
    assert "id" in data


def test_register_duplicate_email(client, test_user):
    # AC: Registering with an already registered email returns 400
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "customer@example.com",
            "name": "Duplicate User",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client, test_user):
    # AC: Authenticating with valid credentials returns a JWT token
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "customer@example.com"


def test_login_invalid_credentials(client, test_user):
    # AC: Authenticating with invalid credentials returns 401
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
