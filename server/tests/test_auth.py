def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "newpassword",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert "id" in data


def test_register_duplicate_email(client):
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "full_name": "Dup User",
            "password": "password",
        },
    )
    # Duplicate registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "full_name": "Another Dup",
            "password": "password",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "full_name": "Login User",
            "password": "correctpassword",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "correctpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@example.com"


def test_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_json_success(client):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "json_login@example.com",
            "full_name": "JSON Login User",
            "password": "correctpassword",
        },
    )
    # Login JSON
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": "json_login@example.com", "password": "correctpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "json_login@example.com"
