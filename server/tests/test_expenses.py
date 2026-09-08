import uuid


def test_create_expense(client):
    payload = {
        "amount": 45.50,
        "category": "Food",
        "date": "2026-05-18",
        "description": "Grocery shopping",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["amount"] == 45.50
    assert data["category"] == "Food"
    assert data["date"] == "2026-05-18"
    assert data["description"] == "Grocery shopping"


def test_create_expense_validation(client):
    # Negative amount should fail
    invalid_payload = {
        "amount": -10.00,
        "category": "Food",
        "date": "2026-05-18",
        "description": "Invalid expense",
    }
    response = client.post("/api/v1/expenses", json=invalid_payload)
    assert response.status_code in (400, 422)


def test_get_expenses_and_monthly_filtering(client):
    # Add May expense
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 50.00,
            "category": "Food",
            "date": "2026-05-10",
            "description": "May Lunch",
        },
    )
    # Add June expense
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.00,
            "category": "Utilities",
            "date": "2026-06-15",
            "description": "June Electric",
        },
    )

    # Filter for May 2026
    response_may = client.get("/api/v1/expenses?month=2026-05")
    assert response_may.status_code == 200
    may_data = response_may.json()
    assert all(item["date"].startswith("2026-05") for item in may_data)
    assert any(item["description"] == "May Lunch" for item in may_data)
    assert not any(item["description"] == "June Electric" for item in may_data)

    # Filter for June 2026
    response_june = client.get("/api/v1/expenses?month=2026-06")
    assert response_june.status_code == 200
    june_data = response_june.json()
    assert all(item["date"].startswith("2026-06") for item in june_data)
    assert any(item["description"] == "June Electric" for item in june_data)


def test_get_expenses_empty_month(client):
    response = client.get("/api/v1/expenses?month=1999-01")
    assert response.status_code == 200
    assert response.json() == []


def test_monthly_total_spending_display(client):
    # Post expenses in May 2026
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 200.00,
            "category": "Rent",
            "date": "2026-05-01",
            "description": "May Rent",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.00,
            "category": "Food",
            "date": "2026-05-15",
            "description": "May Groceries",
        },
    )

    summary_resp = client.get("/api/v1/dashboard/summary?month=2026-05")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["active_month"] == "2026-05"
    assert summary["monthly_total"] >= 300.00
    assert summary["total_expenses"] >= summary["monthly_total"]

    categories = {cat["category"]: cat for cat in summary["category_breakdown"]}
    assert "Rent" in categories
    assert "Food" in categories


def test_update_expense(client):
    # Create expense
    res = client.post(
        "/api/v1/expenses",
        json={
            "amount": 30.00,
            "category": "Books",
            "date": "2026-05-20",
            "description": "Old Book",
        },
    )
    exp_id = res.json()["id"]

    # Update expense date to June and amount to 40.00
    update_res = client.put(
        f"/api/v1/expenses/{exp_id}",
        json={
            "amount": 40.00,
            "category": "Education",
            "date": "2026-06-01",
            "description": "Updated Book",
        },
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["amount"] == 40.00
    assert updated_data["category"] == "Education"
    assert updated_data["date"] == "2026-06-01"


def test_delete_expense(client):
    res = client.post(
        "/api/v1/expenses",
        json={
            "amount": 15.00,
            "category": "Snacks",
            "date": "2026-05-21",
            "description": "Chips",
        },
    )
    exp_id = res.json()["id"]

    del_res = client.delete(f"/api/v1/expenses/{exp_id}")
    assert del_res.status_code == 200

    get_res = client.get(f"/api/v1/expenses/{exp_id}")
    assert get_res.status_code == 404


def test_get_expense_not_found(client):
    random_id = str(uuid.uuid4())
    res = client.get(f"/api/v1/expenses/{random_id}")
    assert res.status_code == 404
