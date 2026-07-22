import hashlib
from server.models import PersistentSession


def test_register_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "created_at" in data


def test_register_duplicate(client):
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "dupuser",
            "email": "dupuser@example.com",
            "password": "password123",
        },
    )

    # Try duplicate username
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "dupuser",
            "email": "other@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

    # Try duplicate email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "otheruser",
            "email": "dupuser@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "loginuser",
            "email": "loginuser@example.com",
            "password": "password123",
        },
    )

    # Login
    response = client.post(
        "/api/v1/auth/login", json={"username": "loginuser", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "loginuser"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "nonexistent", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]


def test_login_with_remember_me(client, db_session):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "rememberuser",
            "email": "rememberuser@example.com",
            "password": "password123",
        },
    )

    # Login with rememberMe=True
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "rememberuser",
            "password": "password123",
            "rememberMe": True,
        },
    )
    assert response.status_code == 200
    assert "remember_me" in response.cookies

    # Verify persistent session in DB
    cookie_val = response.cookies["remember_me"]
    token_hash = hashlib.sha256(cookie_val.encode()).hexdigest()
    session_record = (
        db_session.query(PersistentSession)
        .filter(PersistentSession.token_hash == token_hash)
        .first()
    )
    assert session_record is not None
    assert session_record.user.username == "rememberuser"


def test_refresh_token_success(client, db_session):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "refreshuser",
            "email": "refreshuser@example.com",
            "password": "password123",
        },
    )

    # Login with rememberMe=True
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "refreshuser",
            "password": "password123",
            "rememberMe": True,
        },
    )
    assert login_response.status_code == 200
    old_cookie = login_response.cookies["remember_me"]

    # Refresh token
    refresh_response = client.post("/api/v1/auth/refresh-token")
    assert refresh_response.status_code == 200
    data = refresh_response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "refreshuser"
    assert "remember_me" in refresh_response.cookies

    new_cookie = refresh_response.cookies["remember_me"]
    assert old_cookie != new_cookie

    # Verify old cookie is rotated and no longer valid
    client.cookies.set("remember_me", old_cookie)
    fail_response = client.post("/api/v1/auth/refresh-token")
    assert fail_response.status_code == 401


def test_refresh_token_invalid_or_expired(client):
    # No cookie
    response = client.post("/api/v1/auth/refresh-token")
    assert response.status_code == 401

    # Invalid cookie
    client.cookies.set("remember_me", "invalid_token_value")
    response = client.post("/api/v1/auth/refresh-token")
    assert response.status_code == 401


def test_logout(client, db_session):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "logoutuser",
            "email": "logoutuser@example.com",
            "password": "password123",
        },
    )

    # Login with rememberMe=True
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "logoutuser",
            "password": "password123",
            "rememberMe": True,
        },
    )
    assert login_response.status_code == 200
    cookie_val = login_response.cookies["remember_me"]

    # Logout
    logout_response = client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 200
    assert logout_response.json()["detail"] == "Successfully logged out"

    # Verify cookie is cleared (either deleted or empty)
    assert (
        "remember_me" not in logout_response.cookies
        or logout_response.cookies["remember_me"] == ""
    )

    # Verify persistent session is deleted from DB
    token_hash = hashlib.sha256(cookie_val.encode()).hexdigest()
    session_record = (
        db_session.query(PersistentSession)
        .filter(PersistentSession.token_hash == token_hash)
        .first()
    )
    assert session_record is None
