def test_create_and_get_budget(client):
    cats = client.get("/api/v1/categories").json()
    trans_cat = next(c for c in cats if c["name"] == "Transportation")

    # Add an expense for Transportation in May 2026
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Gas Refill",
            "amount": 125.00,
            "category_id": trans_cat["id"],
            "expense_date": "2026-05-10",
        },
    )

    # Set budget of $500 for Transportation in May 2026
    payload = {
        "category_id": trans_cat["id"],
        "monthly_limit": 500.00,
        "month": 5,
        "year": 2026,
    }
    response = client.post("/api/v1/budgets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["category_id"] == trans_cat["id"]
    assert data["category_name"] == "Transportation"
    assert data["monthly_limit"] == 500.00
    assert data["month"] == 5
    assert data["year"] == 2026
    assert data["total_spent"] == 125.00
    assert data["remaining_balance"] == 375.00
    assert data["utilization_percentage"] == 25.0

    # Get single budget
    budget_id = data["id"]
    get_resp = client.get(f"/api/v1/budgets/{budget_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == budget_id


def test_update_existing_budget_limit(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")

    # Create initial budget
    client.post(
        "/api/v1/budgets",
        json={
            "category_id": food_cat["id"],
            "monthly_limit": 600.00,
            "month": 5,
            "year": 2026,
        },
    )

    # Upsert with new limit
    upsert_resp = client.post(
        "/api/v1/budgets",
        json={
            "category_id": food_cat["id"],
            "monthly_limit": 700.00,
            "month": 5,
            "year": 2026,
        },
    )
    assert upsert_resp.status_code == 201
    assert upsert_resp.json()["monthly_limit"] == 700.00


def test_create_budget_invalid_inputs(client):
    cats = client.get("/api/v1/categories").json()
    cat_id = cats[0]["id"]

    # Negative limit
    resp1 = client.post(
        "/api/v1/budgets",
        json={"category_id": cat_id, "monthly_limit": -50.0, "month": 5, "year": 2026},
    )
    assert resp1.status_code == 422

    # Invalid month (13)
    resp2 = client.post(
        "/api/v1/budgets",
        json={"category_id": cat_id, "monthly_limit": 500.0, "month": 13, "year": 2026},
    )
    assert resp2.status_code == 422

    # Invalid year (1999)
    resp3 = client.post(
        "/api/v1/budgets",
        json={"category_id": cat_id, "monthly_limit": 500.0, "month": 5, "year": 1999},
    )
    assert resp3.status_code == 422


def test_delete_budget(client):
    cats = client.get("/api/v1/categories").json()
    cat_id = cats[0]["id"]

    create_resp = client.post(
        "/api/v1/budgets",
        json={
            "category_id": cat_id,
            "monthly_limit": 300.00,
            "month": 6,
            "year": 2026,
        },
    )
    budget_id = create_resp.json()["id"]

    del_resp = client.delete(f"/api/v1/budgets/{budget_id}")
    assert del_resp.status_code == 204
    assert client.get(f"/api/v1/budgets/{budget_id}").status_code == 404
