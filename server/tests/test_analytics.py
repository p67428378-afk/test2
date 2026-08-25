def test_analytics_summary(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")
    util_cat = next(c for c in cats if c["name"] == "Utilities")

    # Set budgets for month=5, year=2026
    client.post(
        "/api/v1/budgets",
        json={
            "category_id": food_cat["id"],
            "monthly_limit": 300.00,
            "month": 5,
            "year": 2026,
        },
    )
    client.post(
        "/api/v1/budgets",
        json={
            "category_id": util_cat["id"],
            "monthly_limit": 200.00,
            "month": 5,
            "year": 2026,
        },
    )

    # Add expenses: Food over budget ($350 > $300), Utilities within budget ($80 < $200)
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Supermarket Dinner",
            "amount": 350.00,
            "category_id": food_cat["id"],
            "expense_date": "2026-05-10",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Water & Electric",
            "amount": 80.00,
            "category_id": util_cat["id"],
            "expense_date": "2026-05-15",
        },
    )

    # Fetch summary for month=5, year=2026
    response = client.get("/api/v1/analytics/summary?month=5&year=2026")
    assert response.status_code == 200
    data = response.json()
    assert data["total_spent"] == 430.00
    assert data["monthly_budget_limit"] == 500.00
    assert data["remaining_balance"] == 70.00
    assert data["transaction_count"] == 2
    assert data["categories_over_limit_count"] == 1
    assert "Food & Dining" in data["over_limit_categories"]
    assert data["daily_average"] > 0


def test_category_breakdown(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")
    ent_cat = next(c for c in cats if c["name"] == "Entertainment")

    client.post(
        "/api/v1/expenses",
        json={
            "title": "Dining Out",
            "amount": 100.00,
            "category_id": food_cat["id"],
            "expense_date": "2026-05-12",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Movie Tickets",
            "amount": 50.00,
            "category_id": ent_cat["id"],
            "expense_date": "2026-05-14",
        },
    )

    response = client.get("/api/v1/analytics/category-breakdown?month=5&year=2026")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    food_item = next(
        (item for item in data if item["category_name"] == "Food & Dining"), None
    )
    assert food_item is not None
    assert food_item["total_amount"] >= 100.00


def test_monthly_trend(client):
    response = client.get("/api/v1/analytics/monthly-trend?months=6")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 6
    for item in data:
        assert "month" in item
        assert "year" in item
        assert "period" in item
        assert "total_amount" in item
        assert "budget_limit" in item
        assert "transaction_count" in item
