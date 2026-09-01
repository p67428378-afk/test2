def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "hospital-management-system"


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
    assert data["user"]["role"] == "Admin"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_register_new_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "nurse_jane@example.com",
            "password": "securepassword123",
            "role": "Staff",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "nurse_jane@example.com"
    assert data["role"] == "Staff"
    assert "id" in data


def test_register_duplicate_email(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@example.com",
            "password": "somepassword123",
            "role": "Admin",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_get_me(client, staff_headers):
    response = client.get("/api/v1/auth/me", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "Staff"


def test_get_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
