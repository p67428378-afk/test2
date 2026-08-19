def test_create_task_and_crud(client):
    # Get a category and user
    cat_resp = client.get("/api/v1/categories")
    category_id = cat_resp.json()[0]["id"]

    users_resp = client.get("/api/v1/users")
    user_id = users_resp.json()[0]["id"]

    # 1. Create task
    task_payload = {
        "title": "Replace HVAC Filter",
        "description": "Quarterly filter replacement",
        "category_id": category_id,
        "priority": "High",
        "estimated_cost": 25.0,
        "frequency": "Quarterly",
        "due_date": "2026-06-01",
        "assigned_user_id": user_id,
    }

    create_resp = client.post("/api/v1/tasks", json=task_payload)
    assert create_resp.status_code == 201
    task = create_resp.json()
    assert task["title"] == "Replace HVAC Filter"
    assert task["priority"] == "High"
    assert task["estimated_cost"] == 25.0
    task_id = task["id"]

    # 2. Get task detail
    get_resp = client.get(f"/api/v1/tasks/{task_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == task_id

    # 3. List tasks
    list_resp = client.get("/api/v1/tasks", params={"category_id": category_id})
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # 4. Update task
    update_resp = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Replace HVAC Filter - Updated", "priority": "Urgent"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Replace HVAC Filter - Updated"
    assert update_resp.json()["priority"] == "Urgent"

    # 5. Reassign task
    reassign_resp = client.post(
        f"/api/v1/tasks/{task_id}/assign", json={"assigned_user_id": user_id}
    )
    assert reassign_resp.status_code == 200
    assert reassign_resp.json()["assigned_user_id"] == user_id

    # 6. Delete task
    del_resp = client.delete(f"/api/v1/tasks/{task_id}")
    assert del_resp.status_code == 200

    # Verify deleted
    get_again = client.get(f"/api/v1/tasks/{task_id}")
    assert get_again.status_code == 404


def test_task_validation_errors(client):
    # Missing required title and category_id
    resp = client.post(
        "/api/v1/tasks", json={"estimated_cost": -10.0, "due_date": "2026-06-01"}
    )
    assert resp.status_code == 422  # Unprocessable Entity
