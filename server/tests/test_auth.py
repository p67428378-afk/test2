def test_login_seeded_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newowner@example.com",
            "password": "password123",
            "full_name": "New Owner",
            "role": "owner",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newowner@example.com"
    assert data["full_name"] == "New Owner"
    assert data["role"] == "owner"


def test_register_duplicate_email(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Duplicate Owner",
            "role": "owner",
        },
    )
    assert response.status_code == 400


def test_get_me(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
