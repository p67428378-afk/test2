def test_cost_summary(client):
    # Get a category
    cat_resp = client.get("/api/v1/categories")
    category_id = cat_resp.json()[0]["id"]

    # Create two tasks
    client.post(
        "/api/v1/tasks",
        json={
            "title": "Lawn Mowing",
            "category_id": category_id,
            "priority": "Medium",
            "estimated_cost": 50.0,
            "due_date": "2026-05-15",
        },
    )

    task2_resp = client.post(
        "/api/v1/tasks",
        json={
            "title": "Clean Gutters",
            "category_id": category_id,
            "priority": "High",
            "estimated_cost": 100.0,
            "due_date": "2026-05-20",
        },
    )
    task2_id = task2_resp.json()["id"]

    # Complete task 2 with actual cost
    client.post(f"/api/v1/tasks/{task2_id}/complete", json={"actual_cost": 120.0})

    # Fetch cost summary
    summary_resp = client.get("/api/v1/costs/summary")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert "total_estimated" in summary
    assert "total_actual" in summary
    assert "variance" in summary
    assert isinstance(summary["category_breakdown"], list)
