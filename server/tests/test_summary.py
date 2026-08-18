def test_expense_summary_aggregation(client):
    # Fetch categories
    cat_resp = client.get("/api/v1/categories")
    categories = cat_resp.json()
    food_cat = next(c for c in categories if c["name"] == "Food & Dining")
    transport_cat = next(c for c in categories if c["name"] == "Transport")

    # Create test expenses
    client.post("/api/v1/expenses", json={
        "amount": 100.00,
        "date": "2026-02-01",
        "category_id": food_cat["id"],
        "payment_method": "Credit Card",
        "description": "Dinner"
    })
    client.post("/api/v1/expenses", json={
        "amount": 50.00,
        "date": "2026-02-05",
        "category_id": transport_cat["id"],
        "payment_method": "Debit Card",
        "description": "Gas"
    })

    # Query summary
    summary_resp = client.get("/api/v1/expenses/summary?start_date=2026-02-01&end_date=2026-02-28")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()

    assert summary["total_expense"] >= 150.00
    assert summary["total_transactions"] >= 2
    assert summary["start_date"] == "2026-02-01"
    assert summary["end_date"] == "2026-02-28"
    assert len(summary["by_category"]) >= 2

    food_item = next(item for item in summary["by_category"] if item["category_id"] == food_cat["id"])
    assert food_item["total"] >= 100.00
    assert food_item["count"] >= 1
