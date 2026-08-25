def test_register_user(client):
    # AC: Users can register with email, password, and role
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newseeker@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newseeker@example.com"
    assert data["role"] == "job_seeker"
    assert "id" in data

def test_register_duplicate_email(client):
    # AC: Duplicate email returns 400 Bad Request
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_user(client):
    # AC: Users can login and receive a JWT token
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "loginuser@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "loginuser@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    # AC: Invalid credentials returns 401 Unauthorized
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_get_me(client):
    # AC: Authenticated users can retrieve their profile
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "me@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "me@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"
