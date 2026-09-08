def test_create_and_get_expense(client, auth_headers):
    # Fetch a category first
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    tx_data = {
        "amount": 45.50,
        "date": "2026-05-18",
        "transaction_type": "Expense",
        "category_id": cat_id,
        "payment_method": "Credit Card",
        "description": "Lunch with team",
        "receipt_url": "https://example.com/receipt.png",
    }
    create_res = client.post("/api/v1/expenses", headers=auth_headers, json=tx_data)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["amount"] == 45.50
    assert created["transaction_type"] == "Expense"
    assert created["description"] == "Lunch with team"
    assert created["payment_method"] == "Credit Card"
    assert created["category"]["id"] == cat_id
    assert "id" in created

    # Get single expense
    tx_id = created["id"]
    get_res = client.get(f"/api/v1/expenses/{tx_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == tx_id


def test_create_income_transaction(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Income", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    tx_data = {
        "amount": 5000.00,
        "date": "2026-05-01",
        "transaction_type": "Income",
        "category_id": cat_id,
        "payment_method": "Direct Deposit",
        "description": "Monthly Salary",
    }
    create_res = client.post("/api/v1/expenses", headers=auth_headers, json=tx_data)
    assert create_res.status_code == 201
    assert create_res.json()["transaction_type"] == "Income"
    assert create_res.json()["amount"] == 5000.00


def test_create_invalid_amount(client, auth_headers):
    tx_data = {
        "amount": -10.00,
        "date": "2026-05-18",
        "transaction_type": "Expense",
        "payment_method": "Cash",
    }
    res = client.post("/api/v1/expenses", headers=auth_headers, json=tx_data)
    assert res.status_code == 422


def test_create_zero_amount(client, auth_headers):
    tx_data = {
        "amount": 0.0,
        "date": "2026-05-18",
        "transaction_type": "Expense",
        "payment_method": "Cash",
    }
    res = client.post("/api/v1/expenses", headers=auth_headers, json=tx_data)
    assert res.status_code == 422


def test_create_invalid_category(client, auth_headers):
    tx_data = {
        "amount": 25.0,
        "date": "2026-05-18",
        "transaction_type": "Expense",
        "category_id": "non-existent-uuid-12345",
        "payment_method": "Cash",
    }
    res = client.post("/api/v1/expenses", headers=auth_headers, json=tx_data)
    assert res.status_code == 400


def test_transaction_filtering_and_pagination(client, auth_headers):
    cats_res = client.get("/api/v1/categories", headers=auth_headers)
    cat_expense = [c for c in cats_res.json() if c["type"] == "Expense"][0]
    cat_income = [c for c in cats_res.json() if c["type"] == "Income"][0]

    # Insert test transactions
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 100.0,
            "date": "2026-05-01",
            "transaction_type": "Expense",
            "category_id": cat_expense["id"],
            "payment_method": "Debit Card",
            "description": "Groceries store A",
        },
    )
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 200.0,
            "date": "2026-05-10",
            "transaction_type": "Expense",
            "category_id": cat_expense["id"],
            "payment_method": "Credit Card",
            "description": "Groceries store B",
        },
    )
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 1500.0,
            "date": "2026-05-15",
            "transaction_type": "Income",
            "category_id": cat_income["id"],
            "payment_method": "Bank Transfer",
            "description": "Freelance project",
        },
    )

    # Test pagination
    list_res = client.get("/api/v1/expenses?skip=0&limit=2", headers=auth_headers)
    assert list_res.status_code == 200
    page_data = list_res.json()
    assert len(page_data["items"]) == 2
    assert page_data["total"] >= 3

    # Test date range filtering
    range_res = client.get(
        "/api/v1/expenses?start_date=2026-05-05&end_date=2026-05-12",
        headers=auth_headers,
    )
    assert range_res.status_code == 200
    items = range_res.json()["items"]
    assert len(items) == 1
    assert items[0]["date"] == "2026-05-10"

    # Test type filtering
    type_res = client.get("/api/v1/expenses?type=Income", headers=auth_headers)
    assert type_res.status_code == 200
    for item in type_res.json()["items"]:
        assert item["transaction_type"] == "Income"

    # Test category filtering
    cat_res = client.get(
        f"/api/v1/expenses?category_id={cat_income['id']}", headers=auth_headers
    )
    assert cat_res.status_code == 200
    assert all(
        item["category_id"] == cat_income["id"] for item in cat_res.json()["items"]
    )

    # Test payment method filtering
    pm_res = client.get(
        "/api/v1/expenses?payment_method=Bank Transfer", headers=auth_headers
    )
    assert pm_res.status_code == 200
    assert all(
        item["payment_method"] == "Bank Transfer" for item in pm_res.json()["items"]
    )

    # Test search filtering
    search_res = client.get("/api/v1/expenses?search=Groceries", headers=auth_headers)
    assert search_res.status_code == 200
    assert len(search_res.json()["items"]) == 2


def test_update_and_delete_expense(client, auth_headers):
    # Create
    create_res = client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 50.0,
            "date": "2026-05-20",
            "transaction_type": "Expense",
            "payment_method": "Cash",
            "description": "Initial description",
        },
    )
    tx_id = create_res.json()["id"]

    # Update
    update_res = client.put(
        f"/api/v1/expenses/{tx_id}",
        headers=auth_headers,
        json={
            "amount": 65.0,
            "description": "Updated description",
            "payment_method": "Credit Card",
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["amount"] == 65.0
    assert update_res.json()["description"] == "Updated description"
    assert update_res.json()["payment_method"] == "Credit Card"

    # Delete
    del_res = client.delete(f"/api/v1/expenses/{tx_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Confirm deleted
    get_res = client.get(f"/api/v1/expenses/{tx_id}", headers=auth_headers)
    assert get_res.status_code == 404
