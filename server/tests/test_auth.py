def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "nurse_new@example.com",
            "password": "nursepassword123",
            "full_name": "Nurse Joy",
            "role": "Nurse",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "nurse_new@example.com"
    assert data["role"] == "Nurse"
    assert "id" in data


def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@example.com"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_me(client, admin_headers):
    response = client.get("/api/v1/auth/me", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "Admin"
