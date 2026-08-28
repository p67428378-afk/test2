def test_list_users(client):
    response = client.get("/api/v1/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2
    emails = [u["email"] for u in users]
    assert "test@example.com" in emails
    assert "admin@example.com" in emails


def test_get_user_by_id(client):
    response = client.get("/api/v1/users/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    assert data["email"] == "test@example.com"
    assert data["role"] == "EMPLOYEE"


def test_get_user_not_found(client):
    response = client.get("/api/v1/users/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_user(client):
    new_user = {
        "email": "new.employee@example.com",
        "full_name": "New Employee",
        "role": "EMPLOYEE",
        "manager_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    }
    response = client.post("/api/v1/users", json=new_user)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new.employee@example.com"
    assert data["full_name"] == "New Employee"
    assert "id" in data


def test_create_duplicate_user_fails(client):
    existing_user = {
        "email": "test@example.com",
        "full_name": "Duplicate Test",
        "role": "EMPLOYEE",
    }
    response = client.post("/api/v1/users", json=existing_user)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]
