def test_login_seeded_users(client):
    # Test seeded attendee user login
    res_attendee = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert res_attendee.status_code == 200
    data = res_attendee.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "ATTENDEE"

    # Test seeded admin user login
    res_admin = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert res_admin.status_code == 200
    assert res_admin.json()["user"]["role"] == "ORGANIZER"


def test_register_and_get_me(client):
    res_reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "full_name": "New User",
            "role": "ATTENDEE",
        },
    )
    assert res_reg.status_code == 201
    assert res_reg.json()["email"] == "newuser@example.com"

    # Login with new user
    res_login = client.post(
        "/api/v1/auth/login",
        json={"email": "newuser@example.com", "password": "password123"},
    )
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]

    # Call /me endpoint
    res_me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "newuser@example.com"
