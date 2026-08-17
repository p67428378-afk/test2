def test_register_user(client):
    response = client.post(
        "/api/v1/users/register",
        json={
            "email": "newuser@example.com",
            "password": "newpassword",
            "is_admin": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_register_duplicate_user(client):
    # Register first time
    client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "password", "is_admin": False},
    )
    # Register second time
    response = client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "password", "is_admin": False},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_user(client):
    # Register user
    client.post(
        "/api/v1/users/register",
        json={"email": "login@example.com", "password": "password", "is_admin": False},
    )
    # Login
    response = client.post(
        "/api/v1/users/login",
        data={"username": "login@example.com", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
