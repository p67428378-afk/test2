
# Tests are automatically derived from the spec
import pytest

def test_create_task_with_valid_data():
    """From spec: POST /api/tasks with title creates task"""
    response = client.post("/api/tasks", json={
        "title": "Test Task",
        "priority": "high",
        "due_date": "2024-12-31"
    })
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_create_task_without_title_fails():
    """From spec: Tasks cannot have empty titles"""
    response = client.post("/api/tasks", json={
        "title": ""
    })
    assert response.status_code == 400

def test_high_priority_requires_due_date():
    """From spec: High priority tasks must have due_date"""
    response = client.post("/api/tasks", json={
        "title": "Urgent",
        "priority": "high"
        # Missing due_date
    })
    assert response.status_code == 400

def test_cannot_edit_completed_task():
    """From spec: Completed tasks cannot be edited"""
    # First create and complete a task
    task = create_test_task()
    client.put(f"/api/tasks/{task.id}", json={"status": "completed"})
    
    # Try to edit completed task
    response = client.put(f"/api/tasks/{task.id}", json={"title": "Changed"})
    assert response.status_code == 400
