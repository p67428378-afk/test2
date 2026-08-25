def test_login_success_admin(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "admin"


def test_login_success_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "user"


def test_login_failure_wrong_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"


def test_token_alias_endpoint(client):
    response = client.post(
        "/api/v1/auth/token",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
