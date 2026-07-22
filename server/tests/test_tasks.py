import uuid
from server import models


def test_create_task(client):
    response = client.post(
        "/api/v1/tasks", json={"title": "Test Task", "assignee": "Alex Rivera"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Test Task"
    assert data["status"] == "To Do"
    assert data["assignee"] == "Alex Rivera"
    assert "created_at" in data
    assert "updated_at" in data


def test_get_tasks(client, db):
    # Seed some tasks
    task1 = models.Task(title="Task 1", status="To Do", assignee="Alex Rivera")
    task2 = models.Task(title="Task 2", status="In Progress", assignee="Sarah Chen")
    task3 = models.Task(title="Task 3", status="Done", assignee=None)
    db.add_all([task1, task2, task3])
    db.commit()

    # Get all tasks (default desc)
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    titles = [t["title"] for t in data]
    assert "Task 1" in titles
    assert "Task 2" in titles
    assert "Task 3" in titles

    # Filter by status
    response = client.get("/api/v1/tasks?status=In Progress")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Task 2"
    assert data[0]["assignee"] == "Sarah Chen"


def test_update_task_status(client, db):
    task = models.Task(title="Update Me", status="To Do", assignee="Alex Rivera")
    db.add(task)
    db.commit()
    db.refresh(task)

    # Update to In Progress and change assignee
    response = client.patch(
        f"/api/v1/tasks/{task.id}",
        json={"status": "In Progress", "assignee": "Sarah Chen"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "In Progress"
    assert data["assignee"] == "Sarah Chen"

    # Update to Done
    response = client.patch(f"/api/v1/tasks/{task.id}", json={"status": "Done"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Done"
    # Assignee should remain Sarah Chen since we didn't pass a new one
    assert data["assignee"] == "Sarah Chen"


def test_update_task_not_found(client):
    random_uuid = str(uuid.uuid4())
    response = client.patch(
        f"/api/v1/tasks/{random_uuid}", json={"status": "In Progress"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task with the specified ID not found."


def test_websocket_broadcast(client):
    with client.websocket_connect("/ws/v1/worklist") as websocket:
        # Create a task via REST API
        response = client.post(
            "/api/v1/tasks", json={"title": "WS Task", "assignee": "Alex Rivera"}
        )
        assert response.status_code == 201

        # Receive message from WebSocket
        data = websocket.receive_json()
        assert data["event"] == "task_created"
        assert data["data"]["title"] == "WS Task"
        assert data["data"]["status"] == "To Do"
        assert data["data"]["assignee"] == "Alex Rivera"

        task_id = response.json()["id"]

        # Update task status via REST API
        response = client.patch(
            f"/api/v1/tasks/{task_id}",
            json={"status": "In Progress", "assignee": "Sarah Chen"},
        )
        assert response.status_code == 200

        # Receive message from WebSocket
        data = websocket.receive_json()
        assert data["event"] == "task_updated"
        assert data["data"]["status"] == "In Progress"
        assert data["data"]["assignee"] == "Sarah Chen"
