def test_login_donor_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "Donor"


def test_login_admin_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@example.com"
    assert data["user"]["role"] == "Admin"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_register_user_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newdonor@example.com",
            "password": "password123",
            "full_name": "New Donor",
            "role": "Donor",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newdonor@example.com"
    assert data["full_name"] == "New Donor"


def test_read_users_me(client, donor_headers):
    response = client.get("/api/v1/auth/me", headers=donor_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
