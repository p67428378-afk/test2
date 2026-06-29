def test_register_user(client):
    # AC: Users must be able to create an account and log in securely.
    response = client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "user@example.com"
    assert "id" in data


def test_register_duplicate_email(client):
    # AC: Users must be able to create an account and log in securely.
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    response = client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "anotherpassword"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_user(client):
    # AC: Password hashing and secure session management must be implemented.
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    response = client.post(
        "/api/v1/users/login",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    # AC: Password hashing and secure session management must be implemented.
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "password": "securepassword"},
    )
    response = client.post(
        "/api/v1/users/login",
        json={"email": "user@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
