def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "newpassword",
            "role": "user",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert data["role"] == "user"
    assert "id" in data


def test_register_duplicate_email(client):
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "full_name": "Dup User",
            "password": "password",
            "role": "user",
        },
    )
    # Duplicate registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "full_name": "Dup User 2",
            "password": "password",
            "role": "user",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client):
    # Login with seeded test user
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"


def test_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
