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


def test_dashboard_stats_empty(client):
    headers = get_auth_headers(client, "dash1@example.com", "password123")
    response = client.get("/api/v1/dashboard/stats", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tasks"] == 0
    assert data["completed_tasks"] == 0
    assert data["in_progress_tasks"] == 0
    assert data["overdue_tasks"] == 0
    assert data["completion_rate"] == 0.0


def test_dashboard_stats_with_tasks(client):
    headers = get_auth_headers(client, "dash2@example.com", "password123")

    # Create 1 completed task
    client.post(
        "/api/v1/tasks",
        json={"title": "Completed Task", "status": "Completed"},
        headers=headers,
    )

    # Create 1 in progress task
    client.post(
        "/api/v1/tasks",
        json={"title": "In Progress Task", "status": "In Progress"},
        headers=headers,
    )

    # Create 1 overdue task (status Pending, due date in the past)
    past_due = (datetime.utcnow() - timedelta(days=1)).isoformat()
    client.post(
        "/api/v1/tasks",
        json={"title": "Overdue Task", "status": "Pending", "due_date": past_due},
        headers=headers,
    )

    response = client.get("/api/v1/dashboard/stats", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tasks"] == 3
    assert data["completed_tasks"] == 1
    assert data["in_progress_tasks"] == 1
    assert data["overdue_tasks"] == 1
    assert data["completion_rate"] == 33.33
