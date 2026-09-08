def test_set_and_get_budget_normal(client, auth_headers):
    # Get a category
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    # Set budget of $500 for 2026-06
    budget_res = client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={"category_id": cat_id, "monthly_limit": 500.0, "month": "2026-06"},
    )
    assert budget_res.status_code == 201
    assert budget_res.json()["monthly_limit"] == 500.0
    assert budget_res.json()["month"] == "2026-06"

    # Log an expense of $100 in 2026-06
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 100.0,
            "date": "2026-06-10",
            "transaction_type": "Expense",
            "category_id": cat_id,
            "payment_method": "Credit Card",
        },
    )

    # Check budget status
    status_res = client.get("/api/v1/budgets?month=2026-06", headers=auth_headers)
    assert status_res.status_code == 200
    budgets = status_res.json()
    assert len(budgets) == 1
    b = budgets[0]
    assert b["monthly_limit"] == 500.0
    assert b["spent"] == 100.0
    assert b["percentage"] == 20.0
    assert b["alert_level"] == "NORMAL"


def test_budget_warning_alert_80_percent(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[1]["id"]

    # Set budget of $500 for 2026-07
    client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={"category_id": cat_id, "monthly_limit": 500.0, "month": "2026-07"},
    )

    # Log expense of $410 (82% of 500)
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 410.0,
            "date": "2026-07-15",
            "transaction_type": "Expense",
            "category_id": cat_id,
            "payment_method": "Debit Card",
        },
    )

    status_res = client.get("/api/v1/budgets?month=2026-07", headers=auth_headers)
    assert status_res.status_code == 200
    b = status_res.json()[0]
    assert b["spent"] == 410.0
    assert b["percentage"] == 82.0
    assert b["alert_level"] == "WARNING"


def test_budget_breached_alert_100_percent(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[2]["id"]

    # Set budget of $200 for 2026-08
    client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={"category_id": cat_id, "monthly_limit": 200.0, "month": "2026-08"},
    )

    # Log expense of $210 (105% of 200)
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 210.0,
            "date": "2026-08-20",
            "transaction_type": "Expense",
            "category_id": cat_id,
            "payment_method": "Cash",
        },
    )

    status_res = client.get("/api/v1/budgets?month=2026-08", headers=auth_headers)
    assert status_res.status_code == 200
    b = status_res.json()[0]
    assert b["spent"] == 210.0
    assert b["percentage"] == 105.0
    assert b["alert_level"] == "BREACHED"


def test_budget_negative_limit_rejected(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    res = client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={"category_id": cat_id, "monthly_limit": -50.0, "month": "2026-09"},
    )
    assert res.status_code == 422


def test_budget_delete(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    b_res = client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={"category_id": cat_id, "monthly_limit": 300.0, "month": "2026-10"},
    )
    b_id = b_res.json()["id"]

    del_res = client.delete(f"/api/v1/budgets/{b_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Status should now be empty for that month
    status_res = client.get("/api/v1/budgets?month=2026-10", headers=auth_headers)
    assert status_res.status_code == 200
    assert len(status_res.json()) == 0
