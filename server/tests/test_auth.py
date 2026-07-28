from fastapi import status


def test_register_user_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "newinvestigator@example.com",
            "password": "securepassword",
            "role_name": "Investigator",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["username"] == "newinvestigator@example.com"
    assert "id" in data
    assert "role_id" in data


def test_register_user_duplicate_username(client):
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "dup@example.com",
            "password": "password123",
            "role_name": "Investigator",
        },
    )
    # Duplicate registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "dup@example.com",
            "password": "password123",
            "role_name": "Investigator",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()


def test_register_user_invalid_role(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "invalidrole@example.com",
            "password": "password123",
            "role_name": "NonExistentRole",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_login_success(client):
    # Login with seeded test user
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "test@example.com"
    assert data["user"]["role"] == "Investigator"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
