from fastapi import status


def test_signup_success(client):
    payload = {
        "email": "signupuser@example.com",
        "password": "SecurePassword123!",
        "full_name": "Signup User",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "signupuser@example.com"
    assert data["full_name"] == "Signup User"
    assert "id" in data
    assert data["role"] == "member"


def test_signup_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "SecurePassword123!",
        "full_name": "Duplicate User",
    }
    response1 = client.post("/api/v1/auth/signup", json=payload)
    assert response1.status_code == status.HTTP_201_CREATED

    response2 = client.post("/api/v1/auth/signup", json=payload)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert response2.json()["detail"] == "Email already registered"


def test_signup_short_password(client):
    payload = {
        "email": "shortpw@example.com",
        "password": "short",
        "full_name": "Short Pw",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_signup_invalid_email(client):
    payload = {
        "email": "not-an-email",
        "password": "ValidPassword123!",
        "full_name": "Invalid Email",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_success_seeded_user(client):
    payload = {
        "email": "test@example.com",
        "password": "testpassword",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_success_new_user(client):
    signup_payload = {
        "email": "loginflow@example.com",
        "password": "MySecretPassword123!",
        "full_name": "Login Flow",
    }
    reg_resp = client.post("/api/v1/auth/signup", json=signup_payload)
    assert reg_resp.status_code == status.HTTP_201_CREATED

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "loginflow@example.com", "password": "MySecretPassword123!"},
    )
    assert login_resp.status_code == status.HTTP_200_OK
    data = login_resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Verify /me endpoint
    token = data["access_token"]
    me_resp = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == status.HTTP_200_OK
    me_data = me_resp.json()
    assert me_data["email"] == "loginflow@example.com"
    assert me_data["full_name"] == "Login Flow"


def test_login_invalid_password(client):
    payload = {
        "email": "test@example.com",
        "password": "wrongpassword",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_nonexistent_user(client):
    payload = {
        "email": "nobody@example.com",
        "password": "randompassword",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect email or password"


def test_get_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
