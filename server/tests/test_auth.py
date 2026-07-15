def test_register_visitor(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newvisitor@example.com",
            "password": "password123",
            "full_name": "Jane Doe",
            "phone": "+123456789",
            "gov_id": "GOV-9999",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newvisitor@example.com"
    assert data["full_name"] == "Jane Doe"
    assert data["is_verified"] is True


def test_register_duplicate_gov_id(client):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "visitor1@example.com",
            "password": "password123",
            "full_name": "Jane Doe",
            "phone": "+123456789",
            "gov_id": "GOV-9999",
        },
    )
    # Register second with same gov_id
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "visitor2@example.com",
            "password": "password123",
            "full_name": "Another Jane",
            "phone": "+987654321",
            "gov_id": "GOV-9999",
        },
    )
    assert response.status_code == 400
    assert "Duplicate registration" in response.json()["detail"]


def test_login(client):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login_test@example.com",
            "password": "mypassword",
            "full_name": "Login Test",
            "phone": "+123456789",
            "gov_id": "GOV-LOGIN",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login_test@example.com", "password": "mypassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "visitor"
