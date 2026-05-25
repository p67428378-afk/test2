from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_task():
    response = client.post(
        "/api/v1/tasks/",
        json={"description": "Test Task", "due_date": "2024-12-31", "priority": "High"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Test Task"
    assert not data["is_complete"]

def test_get_tasks():
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_task():
    # First create a task
    response = client.post(
        "/api/v1/tasks/",
        json={"description": "Test Task 2", "due_date": "2024-12-31", "priority": "Medium"},
    )
    task_id = response.json()["id"]

    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Test Task 2"

def test_update_task():
    # First create a task
    response = client.post(
        "/api/v1/tasks/",
        json={"description": "Test Task 3", "due_date": "2024-12-31", "priority": "Low"},
    )
    task_id = response.json()["id"]

    response = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"description": "Updated Task 3", "due_date": "2025-01-01", "priority": "Urgent"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Updated Task 3"
    assert data["priority"] == "Urgent"

def test_complete_task():
    # First create a task
    response = client.post(
        "/api/v1/tasks/",
        json={"description": "Test Task 4", "due_date": "2024-12-31", "priority": "High"},
    )
    task_id = response.json()["id"]

    response = client.put(f"/api/v1/tasks/{task_id}/complete")
    assert response.status_code == 200
    data = response.json()
    assert data["is_complete"]

def test_delete_task():
    # First create a task
    response = client.post(
        "/api/v1/tasks/",
        json={"description": "Test Task 5", "due_date": "2024-12-31", "priority": "Medium"},
    )
    task_id = response.json()["id"]

    response = client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Test Task 5"

    # Verify it's deleted
    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 404
