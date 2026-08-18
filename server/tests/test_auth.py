def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "Visitor"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newvisitor@example.com",
            "password": "visitorpassword",
            "full_name": "New Visitor",
            "role": "Visitor",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newvisitor@example.com"
    assert data["role"] == "Visitor"


def test_get_me(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    token = login_res.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "Administrator"
