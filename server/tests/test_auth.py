def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Photography Studio Management System API" in response.json()["message"]


def test_seeded_users_login(client):
    # Test Customer Login
    res_cust = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert res_cust.status_code == 200
    data_cust = res_cust.json()
    assert data_cust["role"] == "customer"
    assert "access_token" in data_cust

    # Test Admin Login
    res_admin = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert res_admin.status_code == 200
    assert res_admin.json()["role"] == "admin"

    # Test Photographer Login
    res_photo = client.post(
        "/api/v1/auth/login",
        json={"email": "photographer@example.com", "password": "photographerpassword"},
    )
    assert res_photo.status_code == 200
    assert res_photo.json()["role"] == "photographer"


def test_signup_and_auth_me(client):
    # Signup new user
    signup_payload = {
        "email": "newuser@example.com",
        "password": "newpassword123",
        "full_name": "New User",
        "role": "customer",
    }
    res_signup = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res_signup.status_code == 201
    user_data = res_signup.json()
    assert user_data["email"] == "newuser@example.com"
    assert user_data["full_name"] == "New User"

    # Duplicate signup should fail
    res_dup = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res_dup.status_code == 400

    # Login with new user
    res_login = client.post(
        "/api/v1/auth/login",
        json={"email": "newuser@example.com", "password": "newpassword123"},
    )
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]

    # Access /auth/me
    res_me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "newuser@example.com"


def test_invalid_login(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert res.status_code == 401
