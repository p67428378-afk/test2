"""
Module: server.tests.test_auth
Purpose: Test authentication endpoints.
"""


def test_register_customer_success(client):
    # AC: Given I am a customer, when I open the app, then I can sign up or log into my account.
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new_customer@example.com",
            "full_name": "New Customer",
            "password": "securepassword",
            "phone": "1112223333",
            "role": "customer",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new_customer@example.com"
    assert data["full_name"] == "New Customer"
    assert data["role"] == "customer"
    assert "id" in data


def test_register_duplicate_email_fails(client):
    # AC: Given I am a customer, when I open the app, then I can sign up or log into my account.
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "First User",
            "password": "password123",
            "role": "customer",
        },
    )
    # Register second user with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "Second User",
            "password": "password456",
            "role": "customer",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client):
    # AC: Given I am a customer, when I open the app, then I can sign up or log into my account.
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login_test@example.com",
            "full_name": "Login Test",
            "password": "testpassword",
            "role": "customer",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login_test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login_test@example.com"


def test_login_invalid_credentials_fails(client):
    # AC: Given I am a customer, when I open the app, then I can sign up or log into my account.
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
