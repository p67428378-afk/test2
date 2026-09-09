def test_register_and_login_success(client):
    reg_payload = {
        "email": "newinvestigator@police.gov",
        "full_name": "Detective Miller",
        "password": "securepassword123",
        "role": "Investigator",
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["email"] == "newinvestigator@police.gov"
    assert reg_data["role"] == "Investigator"

    # Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "newinvestigator@police.gov", "password": "securepassword123"},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["user"]["email"] == "newinvestigator@police.gov"


def test_register_duplicate_email_fails(client):
    payload = {
        "email": "admin@example.com",
        "full_name": "Admin Duplicate",
        "password": "password123",
        "role": "Administrator",
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 400
    assert "already registered" in res.json()["detail"]


def test_login_invalid_credentials(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "wrongpassword"},
    )
    assert res.status_code == 401


def test_get_current_user_me(client, investigator_headers):
    res = client.get("/api/v1/auth/me", headers=investigator_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "Investigator"


def test_unauthenticated_request_fails(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
