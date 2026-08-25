from datetime import datetime, timedelta


def get_auth_headers(client, email, password):
    # Register
    client.post("/api/v1/auth/signup", json={"email": email, "password": password})
    # Login
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_task_success(client):
    headers = get_auth_headers(client, "user1@example.com", "password123")
    due_date = (datetime.utcnow() + timedelta(days=1)).isoformat()
    response = client.post(
        "/api/v1/tasks",
        json={
            "title": "Test Task",
            "description": "Test Description",
            "status": "Pending",
            "priority": "High",
            "due_date": due_date,
            "tags": ["work", "urgent"],
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["status"] == "Pending"
    assert data["priority"] == "High"
    assert "id" in data
    assert "user_id" in data


def test_create_task_invalid_status_priority(client):
    headers = get_auth_headers(client, "user2@example.com", "password123")
    response = client.post(
        "/api/v1/tasks",
        json={"title": "Test Task", "status": "InvalidStatus", "priority": "Medium"},
        headers=headers,
    )
    assert response.status_code == 422

    response = client.post(
        "/api/v1/tasks",
        json={"title": "Test Task", "status": "Pending", "priority": "InvalidPriority"},
        headers=headers,
    )
    assert response.status_code == 422


def test_get_task_details(client):
    headers = get_auth_headers(client, "user3@example.com", "password123")
    # Create task
    create_resp = client.post(
        "/api/v1/tasks", json={"title": "Get Task"}, headers=headers
    )
    task_id = create_resp.json()["id"]

    # Get task
    response = client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Get Task"


def test_task_user_isolation(client):
    headers1 = get_auth_headers(client, "user4@example.com", "password123")
    headers2 = get_auth_headers(client, "user5@example.com", "password123")

    # User 1 creates task
    create_resp = client.post(
        "/api/v1/tasks", json={"title": "User 1 Task"}, headers=headers1
    )
    task_id = create_resp.json()["id"]

    # User 2 tries to get User 1's task
    response = client.get(f"/api/v1/tasks/{task_id}", headers=headers2)
    assert response.status_code == 404

    # User 2 tries to update User 1's task
    response = client.put(
        f"/api/v1/tasks/{task_id}", json={"title": "Hacked Title"}, headers=headers2
    )
    assert response.status_code == 404

    # User 2 tries to delete User 1's task
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers2)
    assert response.status_code == 404


def test_update_task_success(client):
    headers = get_auth_headers(client, "user6@example.com", "password123")
    create_resp = client.post(
        "/api/v1/tasks",
        json={"title": "Original Title", "status": "Pending"},
        headers=headers,
    )
    task_id = create_resp.json()["id"]

    response = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Updated Title", "status": "In Progress"},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["status"] == "In Progress"


def test_delete_task_success(client):
    headers = get_auth_headers(client, "user7@example.com", "password123")
    create_resp = client.post(
        "/api/v1/tasks", json={"title": "To Delete"}, headers=headers
    )
    task_id = create_resp.json()["id"]

    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 204

    # Verify deleted
    get_resp = client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert get_resp.status_code == 404


def test_list_tasks_filtering_searching_sorting_pagination(client):
    headers = get_auth_headers(client, "user8@example.com", "password123")

    # Create multiple tasks
    client.post(
        "/api/v1/tasks",
        json={
            "title": "Task A",
            "status": "Pending",
            "priority": "High",
            "tags": ["work"],
        },
        headers=headers,
    )
    client.post(
        "/api/v1/tasks",
        json={
            "title": "Task B",
            "status": "In Progress",
            "priority": "Medium",
            "tags": ["personal"],
        },
        headers=headers,
    )
    client.post(
        "/api/v1/tasks",
        json={
            "title": "Task C",
            "status": "Completed",
            "priority": "Low",
            "tags": ["work"],
        },
        headers=headers,
    )

    # Filter by status
    response = client.get("/api/v1/tasks?status=Completed", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Task C"

    # Filter by priority
    response = client.get("/api/v1/tasks?priority=High", headers=headers)
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["title"] == "Task A"

    # Filter by tag
    response = client.get("/api/v1/tasks?tag=work", headers=headers)
    assert response.status_code == 200
    assert response.json()["total"] == 2

    # Search
    response = client.get("/api/v1/tasks?search=Task B", headers=headers)
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["title"] == "Task B"

    # Pagination
    response = client.get("/api/v1/tasks?skip=1&limit=1", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
    assert response.json()["total"] == 3
