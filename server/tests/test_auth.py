from fastapi import status


def test_register_user_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newkid@example.com",
            "password": "kidpassword123",
            "full_name": "Johnny Kid",
            "role": "child",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "newkid@example.com"
    assert data["role"] == "child"
    assert data["is_parent_verified"] is False


def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword",
        },
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword",
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_me_authenticated(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword",
        },
    )
    token = login_resp.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"


def test_parental_consent_verification(client):
    response = client.post(
        "/api/v1/auth/parental-consent",
        json={
            "parent_email": "test@example.com",
            "consent_granted": True,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "VERIFIED"
    assert data["is_parent_verified"] is True


def test_unverified_account_habit_log_restriction(client):
    # Register unverified child account
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "unverifiedkid@example.com",
            "password": "password123",
            "full_name": "Unverified Kid",
            "role": "child",
        },
    )
    assert reg_resp.status_code == status.HTTP_201_CREATED

    # Login unverified child
    login_resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": "unverifiedkid@example.com",
            "password": "password123",
        },
    )
    token = login_resp.json()["access_token"]

    # Fetch habit ID
    habits_resp = client.get("/api/v1/habits/")
    habit_id = habits_resp.json()[0]["id"]

    # Attempt to log habit with unverified account -> 403 Forbidden
    log_resp = client.post(
        "/api/v1/habits/logs",
        headers={"Authorization": f"Bearer {token}"},
        json={"habit_id": habit_id},
    )
    assert log_resp.status_code == status.HTTP_403_FORBIDDEN
    assert "parental verification" in log_resp.json()["detail"].lower()
