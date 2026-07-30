def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "newpassword",
            "full_name": "New User",
            "role": "volunteer",
            "address": "456 Volunteer Rd",
            "phone_number": "555-123-4567",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert data["role"] == "volunteer"
    assert "id" in data


def test_register_duplicate_email(client):
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "password": "password",
            "full_name": "Dup User",
            "role": "ngo",
            "address": "123 NGO St",
        },
    )
    # Duplicate registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "dup@example.com",
            "password": "password",
            "full_name": "Dup User 2",
            "role": "ngo",
            "address": "123 NGO St",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client):
    # Register a user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "correctpassword",
            "full_name": "Login User",
            "role": "restaurant",
            "address": "123 Restaurant St",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "correctpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@example.com"


def test_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_admin_list_users(client):
    # Login as admin (seeded in database)
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List users
    response = client.get("/api/v1/users", headers=headers)
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2  # test@example.com and admin@example.com
    assert any(u["email"] == "admin@example.com" for u in users)


def test_admin_update_user(client):
    # Login as admin
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Register a user to update
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "update_me@example.com",
            "password": "password",
            "full_name": "Update Me",
            "role": "volunteer",
            "address": "123 Vol St",
        },
    )
    user_id = reg_resp.json()["id"]

    # Update user
    response = client.put(
        f"/api/v1/users/{user_id}",
        json={
            "full_name": "Updated Name",
            "address": "New Address",
            "phone_number": "111-222-3333",
            "is_active": False,
        },
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["address"] == "New Address"
    assert data["is_active"] is False
