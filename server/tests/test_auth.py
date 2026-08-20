def test_login_success_username(client):
    response = client.post(
        "/api/v1/auth/login", json={"username": "timmy", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "timmy"
    assert data["user"]["role"] == "child"


def test_login_success_email(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "timmy"


def test_login_failure_wrong_password(client):
    response = client.post(
        "/api/v1/auth/login", json={"username": "timmy", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username/email or password"


def test_login_failure_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login", json={"username": "nobody", "password": "somepassword"}
    )
    assert response.status_code == 401
