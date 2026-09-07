def test_root_and_health(client):
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "Welcome" in res_root.json()["message"]

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_login_seeded_student(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "student"


def test_login_seeded_faculty(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@example.com"
    assert data["user"]["role"] == "faculty"


def test_register_new_student(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newstudent@college.edu",
            "password": "securepassword123",
            "full_name": "Jane Doe",
            "role": "student",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newstudent@college.edu"
    assert data["full_name"] == "Jane Doe"
    assert data["role"] == "student"
    assert data["is_active"] is True


def test_register_duplicate_email(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "anotherpassword",
            "full_name": "Duplicate User",
            "role": "student",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "password"},
    )
    assert response.status_code == 401


def test_get_me(client, student_auth_headers):
    response = client.get("/api/v1/auth/me", headers=student_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "student"


def test_get_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_logout(client, student_auth_headers):
    response = client.post("/api/v1/auth/logout", headers=student_auth_headers)
    assert response.status_code == 200
    assert "Successfully logged out" in response.json()["message"]
