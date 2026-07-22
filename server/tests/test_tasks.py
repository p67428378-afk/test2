import uuid
import time
from unittest.mock import AsyncMock
from server.main import manager


def test_create_task(client):
    response = client.post(
        "/api/v1/tasks", json={"title": "Test Task 1", "assignee": "John Doe"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task 1"
    assert data["assignee"] == "John Doe"
    assert data["status"] == "To Do"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_task_invalid(client):
    response = client.post("/api/v1/tasks", json={"title": ""})
    assert response.status_code == 422


def test_get_tasks(client):
    # Create some tasks with a small delay to ensure different timestamps
    client.post("/api/v1/tasks", json={"title": "Task A"})
    time.sleep(0.1)
    client.post("/api/v1/tasks", json={"title": "Task B"})

    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    # Default sort is desc, so Task B should be first
    assert data[0]["title"] == "Task B"
    assert data[1]["title"] == "Task A"


def test_get_tasks_filtering_and_sorting(client):
    # Create tasks with different statuses and a small delay
    resp_a = client.post("/api/v1/tasks", json={"title": "Task A"})
    task_a_id = resp_a.json()["id"]
    time.sleep(0.1)
    resp_b = client.post("/api/v1/tasks", json={"title": "Task B"})
    task_b_id = resp_b.json()["id"]

    # Update Task B to In Progress
    client.patch(f"/api/v1/tasks/{task_b_id}", json={"status": "In Progress"})

    # Filter by status 'In Progress'
    response = client.get("/api/v1/tasks?status=In Progress")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Task B"

    # Filter by status 'To Do'
    response = client.get("/api/v1/tasks?status=To Do")
    assert response.status_code == 200
    data = response.json()
    assert any(t["title"] == "Task A" for t in data)
    assert not any(t["title"] == "Task B" for t in data)

    # Sort asc
    response = client.get("/api/v1/tasks?sort=asc")
    assert response.status_code == 200
    data = response.json()
    # Task A was created before Task B
    idx_a = next(i for i, t in enumerate(data) if t["id"] == task_a_id)
    idx_b = next(i for i, t in enumerate(data) if t["id"] == task_b_id)
    assert idx_a < idx_b


def test_update_task_status(client):
    resp = client.post("/api/v1/tasks", json={"title": "Task to Update"})
    task_id = resp.json()["id"]

    response = client.patch(f"/api/v1/tasks/{task_id}", json={"status": "In Progress"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "In Progress"

    # Invalid status
    response = client.patch(
        f"/api/v1/tasks/{task_id}", json={"status": "Invalid Status"}
    )
    assert response.status_code == 400

    # Non-existent task
    random_uuid = str(uuid.uuid4())
    response = client.patch(f"/api/v1/tasks/{random_uuid}", json={"status": "Done"})
    assert response.status_code == 404


def test_websocket_connection(client):
    with client.websocket_connect("/ws/v1/worklist") as websocket:
        # Just connect and close
        pass


def test_websocket_broadcast_mocked(client, monkeypatch):
    mock_broadcast = AsyncMock()
    monkeypatch.setattr(manager, "broadcast", mock_broadcast)

    # Create a task
    response = client.post("/api/v1/tasks", json={"title": "WS Task"})
    assert response.status_code == 201
    task_data = response.json()

    # Verify broadcast was called
    mock_broadcast.assert_called_once()
    args, _ = mock_broadcast.call_args
    assert args[0]["event"] == "task_created"
    assert str(args[0]["data"]["id"]) == task_data["id"]

    # Reset mock and update task
    mock_broadcast.reset_mock()
    response = client.patch(
        f"/api/v1/tasks/{task_data['id']}", json={"status": "In Progress"}
    )
    assert response.status_code == 200

    # Verify broadcast was called
    mock_broadcast.assert_called_once()
    args, _ = mock_broadcast.call_args
    assert args[0]["event"] == "task_updated"
    assert str(args[0]["data"]["id"]) == task_data["id"]
    assert args[0]["data"]["status"] == "In Progress"
