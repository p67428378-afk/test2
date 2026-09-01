"""Unit and integration tests for authentication and user registration."""

import uuid


def test_user_registration_success(client):
    """Test successful user self-registration."""
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": unique_email,
        "password": "StrongPassword123!",
        "full_name": "New Team Member",
        "role": "Member",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == unique_email
    assert data["full_name"] == "New Team Member"
    assert data["role"] == "Member"
    assert data["is_active"] is True
    assert data["is_verified"] is True
    assert "id" in data
    assert "hashed_password" not in data


def test_user_registration_duplicate_email(client):
    """Test registering with an existing email returns 400 Bad Request."""
    payload = {
        "email": "test@example.com",  # Already seeded
        "password": "StrongPassword123!",
        "full_name": "Duplicate User",
        "role": "Member",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_user_registration_short_password(client):
    """Test registering with a password < 8 characters returns 422."""
    payload = {
        "email": f"short_{uuid.uuid4().hex[:8]}@example.com",
        "password": "short",
        "full_name": "Short Pass",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


def test_login_success(client):
    """Test logging in with seeded user credentials returns JWT token."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
    """Test login failure with incorrect password returns 401."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    """Test login failure with unknown user returns 401."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "unknown@example.com", "password": "somepassword"},
    )
    assert response.status_code == 401


def test_get_current_user_me(client, user_headers):
    """Test retrieving authenticated user profile."""
    response = client.get("/api/v1/auth/me", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "Member"


def test_get_current_user_unauthorized(client):
    """Test accessing protected endpoint without token returns 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
