from datetime import datetime, timedelta, timezone


def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_get_worklist_unauthenticated(client):
    response = client.get("/api/v1/worklist")
    assert response.status_code == 401


def test_get_worklist_success(client):
    # First login to get token
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/worklist", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) > 0
    assert data["total"] >= len(data["items"])


def test_create_worklist_item(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create item
    response = client.post(
        "/api/v1/worklist",
        json={"title": "New test task", "status": "pending"},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New test task"
    assert data["status"] == "pending"
    assert "id" in data

    # Verify it is in the list
    list_response = client.get("/api/v1/worklist", headers=headers)
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert any(item["title"] == "New test task" for item in list_data["items"])


def test_get_worklist_pagination(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get with limit=2
    response = client.get("/api/v1/worklist", params={"limit": 2}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2

    # Get with skip=2, limit=2
    response_skip = client.get(
        "/api/v1/worklist", params={"skip": 2, "limit": 2}, headers=headers
    )
    assert response_skip.status_code == 200
    data_skip = response_skip.json()
    assert len(data_skip["items"]) == 2
    assert data_skip["items"][0]["id"] != data["items"][0]["id"]


def test_get_worklist_since(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get current time
    now = datetime.now(timezone.utc)

    # Get items updated since 1 hour ago (should return all seeded items)
    since_time = (now - timedelta(hours=1)).isoformat()
    response = client.get(
        "/api/v1/worklist", params={"since": since_time}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0

    # Get items updated since 1 hour in the future (should return 0 items)
    future_time = (now + timedelta(hours=1)).isoformat()
    response_future = client.get(
        "/api/v1/worklist", params={"since": future_time}, headers=headers
    )
    assert response_future.status_code == 200
    data_future = response_future.json()
    assert len(data_future["items"]) == 0
