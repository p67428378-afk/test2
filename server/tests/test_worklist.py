from fastapi.testclient import TestClient


def get_auth_headers(client: TestClient):
    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "testpassword"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_worklist_unauthorized(client: TestClient):
    response = client.get("/api/v1/worklist")
    assert response.status_code == 401


def test_get_worklist_success(client: TestClient):
    headers = get_auth_headers(client)
    response = client.get("/api/v1/worklist", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert data[0]["name"] == "Implement OAuth2 Authentication"
    assert data[0]["status"] == "To Do"


def test_create_worklist_item(client: TestClient):
    headers = get_auth_headers(client)
    response = client.post(
        "/api/v1/worklist",
        headers=headers,
        json={"name": "New Test Task", "status": "To Do"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Test Task"
    assert data["status"] == "To Do"
    assert "id" in data


def test_update_worklist_item_status(client: TestClient):
    headers = get_auth_headers(client)
    # First get the list to find an ID
    response = client.get("/api/v1/worklist", headers=headers)
    items = response.json()
    task_id = items[0]["id"]

    # Update status to In Progress
    response = client.put(
        f"/api/v1/worklist/{task_id}", headers=headers, json={"status": "In Progress"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "In Progress"


def test_update_worklist_item_invalid_status(client: TestClient):
    headers = get_auth_headers(client)
    response = client.get("/api/v1/worklist", headers=headers)
    items = response.json()
    task_id = items[0]["id"]

    response = client.put(
        f"/api/v1/worklist/{task_id}", headers=headers, json={"status": "InvalidStatus"}
    )
    assert response.status_code == 422


def test_update_worklist_item_not_found(client: TestClient):
    headers = get_auth_headers(client)
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.put(
        f"/api/v1/worklist/{fake_uuid}", headers=headers, json={"status": "Done"}
    )
    assert response.status_code == 404
