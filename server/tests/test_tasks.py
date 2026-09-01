"""Unit and integration tests for Tasks endpoints and Bulk Update."""

import uuid


def test_create_and_get_task(client, user_headers):
    """Test creating a task under a project and retrieving it."""
    # Create project first
    proj_res = client.post(
        "/api/v1/projects",
        json={"name": "Task Proj", "status": "In Progress"},
        headers=user_headers,
    )
    proj_id = proj_res.json()["id"]

    # Create task
    task_res = client.post(
        "/api/v1/tasks",
        json={
            "project_id": proj_id,
            "summary": "Implement Auth",
            "description": "Add JWT tokens and login endpoint",
            "priority": "Medium",
            "status": "To Do",
        },
        headers=user_headers,
    )
    assert task_res.status_code == 201
    task_data = task_res.json()
    task_id = task_data["id"]
    assert task_data["summary"] == "Implement Auth"
    assert task_data["status"] == "To Do"

    # Get task
    get_res = client.get(f"/api/v1/tasks/{task_id}", headers=user_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == task_id


def test_create_task_invalid_project(client, user_headers):
    """Test creating a task referencing non-existent project returns 422."""
    fake_proj_id = str(uuid.uuid4())
    res = client.post(
        "/api/v1/tasks",
        json={
            "project_id": fake_proj_id,
            "summary": "Invalid Task",
            "priority": "Low",
        },
        headers=user_headers,
    )
    assert res.status_code == 422


def test_bulk_task_status_update_success(client, user_headers):
    """Test atomic bulk status update for multiple tasks."""
    proj_res = client.post(
        "/api/v1/projects",
        json={"name": "Bulk Proj", "status": "In Progress"},
        headers=user_headers,
    )
    proj_id = proj_res.json()["id"]

    # Create 2 tasks
    t1 = client.post(
        "/api/v1/tasks",
        json={"project_id": proj_id, "summary": "T1", "status": "To Do"},
        headers=user_headers,
    ).json()
    t2 = client.post(
        "/api/v1/tasks",
        json={"project_id": proj_id, "summary": "T2", "status": "In Progress"},
        headers=user_headers,
    ).json()

    # Bulk update both to Completed
    bulk_res = client.patch(
        "/api/v1/tasks/bulk-update",
        json={"task_ids": [t1["id"], t2["id"]], "status": "Completed"},
        headers=user_headers,
    )
    assert bulk_res.status_code == 200
    data = bulk_res.json()
    assert data["updated_count"] == 2
    for t in data["tasks"]:
        assert t["status"] == "Completed"


def test_bulk_task_status_update_partial_failure_rollback(client, user_headers):
    """Test bulk update with a non-existent task ID returns 404 and does not update existing tasks."""
    proj_res = client.post(
        "/api/v1/projects",
        json={"name": "Rollback Proj", "status": "In Progress"},
        headers=user_headers,
    )
    proj_id = proj_res.json()["id"]

    t1 = client.post(
        "/api/v1/tasks",
        json={"project_id": proj_id, "summary": "T1 Original", "status": "To Do"},
        headers=user_headers,
    ).json()

    fake_id = str(uuid.uuid4())
    bulk_res = client.patch(
        "/api/v1/tasks/bulk-update",
        json={"task_ids": [t1["id"], fake_id], "status": "Completed"},
        headers=user_headers,
    )
    assert bulk_res.status_code == 404

    # Verify t1 was NOT updated
    check_t1 = client.get(f"/api/v1/tasks/{t1['id']}", headers=user_headers).json()
    assert check_t1["status"] == "To Do"


def test_high_priority_escalation_trigger(client, user_headers):
    """Test creating or updating a high-priority task triggers escalation."""
    proj_res = client.post(
        "/api/v1/projects",
        json={"name": "Escalation Proj", "status": "In Progress"},
        headers=user_headers,
    )
    proj_id = proj_res.json()["id"]

    # Create task with High priority
    t_res = client.post(
        "/api/v1/tasks",
        json={"project_id": proj_id, "summary": "Critical Bug", "priority": "High"},
        headers=user_headers,
    )
    assert t_res.status_code == 201

    # Check escalations list
    esc_res = client.get(
        f"/api/v1/analytics/escalations?project_id={proj_id}", headers=user_headers
    )
    assert esc_res.status_code == 200
    logs = esc_res.json()
    assert len(logs) >= 1
    assert any("priority" in log["reason"].lower() for log in logs)
