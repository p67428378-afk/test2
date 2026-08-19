from datetime import datetime, timedelta


def test_get_cost_summary(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    # Create task 1
    t1 = {
        "title": "Cost Task 1",
        "location_equipment": "Unit 1",
        "priority": "High",
        "estimated_cost": 1000.0,
        "due_date": due_date,
    }
    task1_id = client.post("/api/v1/tasks", json=t1).json()["id"]

    # Create task 2
    t2 = {
        "title": "Cost Task 2",
        "location_equipment": "Unit 2",
        "priority": "Medium",
        "estimated_cost": 500.0,
        "due_date": due_date,
    }
    task2_id = client.post("/api/v1/tasks", json=t2).json()["id"]

    # Complete task 1
    client.put(
        f"/api/v1/tasks/{task1_id}/complete",
        json={
            "actual_cost": 950.0,
            "resolution_notes": "Completed successfully under budget",
        },
    )

    summary_res = client.get("/api/v1/costs/summary")
    assert summary_res.status_code == 200
    data = summary_res.json()
    assert "total_estimated_cost" in data
    assert "total_actual_cost" in data
    assert "cost_variance" in data
    assert "completed_tasks_count" in data
    assert "pending_tasks_count" in data
    assert data["total_estimated_cost"] >= 1500.0
    assert data["total_actual_cost"] >= 950.0
    assert data["completed_tasks_count"] >= 1
    assert data["pending_tasks_count"] >= 1
