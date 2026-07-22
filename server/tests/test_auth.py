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
