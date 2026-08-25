def test_signup_success(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "newuser@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["email"] == "newuser@example.com"


def test_signup_duplicate_email(client):
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "dup@example.com", "password": "securepassword123"},
    )
    # Second signup with same email
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "dup@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_signup_invalid_email(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "invalid-email", "password": "securepassword123"},
    )
    assert response.status_code == 422


def test_signup_password_too_short(client):
    response = client.post(
        "/api/v1/auth/signup", json={"email": "short@example.com", "password": "123"}
    )
    assert response.status_code == 422


def test_login_success(client):
    # Register first
    client.post(
        "/api/v1/auth/signup",
        json={"email": "login@example.com", "password": "securepassword123"},
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 3600


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
