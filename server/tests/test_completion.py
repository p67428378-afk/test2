from datetime import date, timedelta


def test_completion_logging_and_recurring(client):
    cat_resp = client.get("/api/v1/categories")
    category_id = cat_resp.json()[0]["id"]

    # Use a future due date so status remains Pending
    future_date = date.today() + timedelta(days=10)
    expected_next_date = future_date + timedelta(days=30)

    # 1. Create a recurring task
    task_payload = {
        "title": "Monthly Air Filter Check",
        "category_id": category_id,
        "priority": "Medium",
        "estimated_cost": 30.0,
        "frequency": "Monthly",
        "due_date": future_date.isoformat(),
    }
    create_resp = client.post("/api/v1/tasks", json=task_payload)
    assert create_resp.status_code == 201
    task_id = create_resp.json()["id"]

    # 2. Mark complete
    complete_resp = client.post(
        f"/api/v1/tasks/{task_id}/complete",
        json={
            "actual_cost": 35.0,
            "notes": "Replaced filter in basement unit",
            "receipt_reference": "REC-998822",
        },
    )
    assert complete_resp.status_code == 200
    comp_data = complete_resp.json()
    assert comp_data["status"] == "Completed"
    assert comp_data["actual_cost"] == 35.0
    assert comp_data["next_task_id"] is not None
    next_task_id = comp_data["next_task_id"]

    # 3. Verify original task is completed
    orig_task_resp = client.get(f"/api/v1/tasks/{task_id}")
    assert orig_task_resp.json()["status"] == "Completed"
    assert orig_task_resp.json()["actual_cost"] == 35.0

    # 4. Verify next task instance was automatically created
    next_task_resp = client.get(f"/api/v1/tasks/{next_task_id}")
    assert next_task_resp.status_code == 200
    next_task = next_task_resp.json()
    assert next_task["title"] == "Monthly Air Filter Check"
    assert next_task["status"] == "Pending"
    assert next_task["due_date"] == expected_next_date.isoformat()

    # 5. Check completion logs endpoint
    logs_resp = client.get(f"/api/v1/tasks/{task_id}/logs")
    assert logs_resp.status_code == 200
    logs = logs_resp.json()
    assert len(logs) == 1
    assert logs[0]["receipt_reference"] == "REC-998822"
