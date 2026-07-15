def test_register_user(client):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "newuser@example.com", "password": "securepassword"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "user_id" in data


def test_register_duplicate_email(client):
    # Register first
    client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "password"},
    )
    # Register again
    response = client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "password"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_user(client):
    # Register
    client.post(
        "/api/v1/users/register",
        json={"email": "login@example.com", "password": "password"},
    )
    # Login
    response = client.post(
        "/api/v1/users/login",
        json={"email": "login@example.com", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/users/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
