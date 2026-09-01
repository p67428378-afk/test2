"""Unit and integration tests for Task and Productivity Analytics endpoints."""


def test_task_analytics_with_tasks(client, user_headers):
    """Test task completion rate and status distribution analytics."""
    proj = client.post(
        "/api/v1/projects",
        json={"name": "Analytics Proj"},
        headers=user_headers,
    ).json()

    # Add 1 Done task and 1 To Do task
    client.post(
        "/api/v1/tasks",
        json={"project_id": proj["id"], "summary": "Done Task", "status": "Done"},
        headers=user_headers,
    )
    client.post(
        "/api/v1/tasks",
        json={"project_id": proj["id"], "summary": "Todo Task", "status": "To Do"},
        headers=user_headers,
    )

    res = client.get(
        f"/api/v1/analytics/tasks?project_id={proj['id']}", headers=user_headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_tasks"] == 2
    assert data["completed_tasks"] == 1
    assert data["todo_tasks"] == 1
    assert data["completion_rate"] == 50.0
    assert "Done" in data["status_distribution"]


def test_task_analytics_empty_project(client, user_headers):
    """Test task analytics for empty project returns 0 completion rate without division by zero error."""
    proj = client.post(
        "/api/v1/projects",
        json={"name": "Empty Proj"},
        headers=user_headers,
    ).json()

    res = client.get(
        f"/api/v1/analytics/tasks?project_id={proj['id']}", headers=user_headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_tasks"] == 0
    assert data["completed_tasks"] == 0
    assert data["completion_rate"] == 0.0


def test_productivity_analytics(client, user_headers):
    """Test team productivity and cycle time analytics."""
    proj = client.post(
        "/api/v1/projects",
        json={"name": "Productivity Proj"},
        headers=user_headers,
    ).json()

    client.post(
        "/api/v1/tasks",
        json={"project_id": proj["id"], "summary": "Quick Task", "status": "Completed"},
        headers=user_headers,
    )

    res = client.get(
        f"/api/v1/analytics/productivity?project_id={proj['id']}", headers=user_headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_completed_tasks"] >= 1
    assert "average_cycle_time_hours" in data
    assert "productivity_by_assignee" in data
