from fastapi import status


def test_register_user(client):
    # AC: Role-Based Access Control and Multi-Portal Authentication
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new_user@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "New Restaurant",
            "phone": "1234567890",
            "address": "123 Main St",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "new_user@example.com"
    assert data["role"] == "donor"
    assert "id" in data


def test_register_duplicate_email(client):
    # AC: Role-Based Access Control and Multi-Portal Authentication
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "New Restaurant",
            "phone": "1234567890",
            "address": "123 Main St",
        },
    )
    # Register second user with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "password": "testpassword",
            "role": "ngo",
            "name": "NGO",
            "phone": "1234567890",
            "address": "123 Main St",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()


def test_login_user(client):
    # AC: Role-Based Access Control and Multi-Portal Authentication
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login_test@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "New Restaurant",
            "phone": "1234567890",
            "address": "123 Main St",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login_test@example.com", "password": "testpassword"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login_test@example.com"


def test_login_invalid_credentials(client):
    # AC: Role-Based Access Control and Multi-Portal Authentication
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
