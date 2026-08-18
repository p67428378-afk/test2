def test_expense_summary(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")
    transport_cat = next(c for c in cats if c["name"] == "Transport")

    # Add test expenses
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.00,
            "date": "2026-05-01",
            "category_id": food_cat["id"],
            "description": "Groceries",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 50.00,
            "date": "2026-05-05",
            "category_id": transport_cat["id"],
            "description": "Gas",
        },
    )

    res = client.get("/api/v1/expenses/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_expense"] >= 150.00
    assert data["total_transactions"] >= 2
    assert isinstance(data["by_category"], list)

    cat_names = [item["category_name"] for item in data["by_category"]]
    assert "Food & Dining" in cat_names
    assert "Transport" in cat_names


def test_expense_summary_date_filtering(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = cats[0]["id"]

    client.post(
        "/api/v1/expenses",
        json={
            "amount": 200.00,
            "date": "2026-01-01",
            "category_id": food_cat,
            "description": "Jan Expense",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 300.00,
            "date": "2026-06-01",
            "category_id": food_cat,
            "description": "Jun Expense",
        },
    )

    res = client.get(
        "/api/v1/expenses/summary?start_date=2026-01-01&end_date=2026-01-31"
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_expense"] == 200.00
    assert data["total_transactions"] == 1
