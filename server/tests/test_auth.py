def test_seeded_users_login(client):
    # Test seeded regular user
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "visitor"

    # Test seeded admin user
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert resp.status_code == 200
    assert resp.json()["user"]["role"] == "admin"

    # Test seeded officer user
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "officer@example.com", "password": "officerpassword"},
    )
    assert resp.status_code == 200
    assert resp.json()["user"]["role"] == "officer"


def test_user_registration(client):
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New Visitor User",
            "role": "visitor",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New Visitor User"


def test_login_invalid_password(client):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_get_me_authenticated(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    token = login_resp.json()["access_token"]

    me_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "admin@example.com"
