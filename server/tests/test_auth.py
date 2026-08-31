from fastapi.testclient import TestClient


def test_login_seeded_test_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["is_active"] is True


def test_login_seeded_admin_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "admin@example.com"
    assert data["user"]["role"] == "admin"


def test_login_invalid_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_register_new_user(client: TestClient):
    reg_payload = {
        "email": "medstudent2026@medicalschool.edu",
        "password": "securepassword123",
        "full_name": "Dr. Candidate Jane Doe",
        "role": "student",
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == reg_payload["email"]
    assert data["user"]["full_name"] == reg_payload["full_name"]

    # Register again should fail with duplicate
    dup_resp = client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_resp.status_code == 400


def test_get_current_user_profile(client: TestClient):
    # Log in to get token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_resp.json()["access_token"]

    # Get profile with valid token
    me_resp = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["email"] == "test@example.com"

    # Get profile without token
    unauth_resp = client.get("/api/v1/auth/me")
    assert unauth_resp.status_code == 401
