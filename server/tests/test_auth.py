def test_register_and_login(client):
    # Register a new user
    register_data = {
        "email": "test@example.com",
        "password": "securepassword",
        "name": "Test User",
    }
    response = client.post("/api/v1/auth/register", json=register_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data

    # Try to register with the same email
    response = client.post("/api/v1/auth/register", json=register_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

    # Login with correct credentials
    login_data = {"email": "test@example.com", "password": "securepassword"}
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Login with incorrect password
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
