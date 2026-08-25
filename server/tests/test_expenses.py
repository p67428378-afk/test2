def test_create_expense_success(client):
    # Get Food & Dining category ID
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")

    payload = {
        "title": "Grocery Shopping",
        "amount": 45.50,
        "category_id": food_cat["id"],
        "expense_date": "2026-05-18",
        "payment_method": "Credit Card",
        "description": "Weekly organic vegetables and fruit",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Grocery Shopping"
    assert data["amount"] == 45.50
    assert data["category_id"] == food_cat["id"]
    assert data["category_name"] == "Food & Dining"
    assert data["expense_date"] == "2026-05-18"
    assert data["payment_method"] == "Credit Card"
    assert data["description"] == "Weekly organic vegetables and fruit"
    assert "id" in data


def test_create_expense_negative_amount_fails(client):
    cats = client.get("/api/v1/categories").json()
    payload = {
        "title": "Invalid Negative Expense",
        "amount": -20.00,
        "category_id": cats[0]["id"],
        "expense_date": "2026-05-18",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 422


def test_create_expense_blank_title_fails(client):
    cats = client.get("/api/v1/categories").json()
    payload = {
        "title": "   ",
        "amount": 25.00,
        "category_id": cats[0]["id"],
        "expense_date": "2026-05-18",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 422


def test_create_expense_invalid_category_fails(client):
    payload = {
        "title": "Coffee",
        "amount": 5.50,
        "category_id": "00000000-0000-0000-0000-000000000000",
        "expense_date": "2026-05-18",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 404


def test_get_expenses_list_and_filters(client):
    cats = client.get("/api/v1/categories").json()
    food_cat = next(c for c in cats if c["name"] == "Food & Dining")
    trans_cat = next(c for c in cats if c["name"] == "Transportation")

    # Create 3 expenses
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Whole Foods",
            "amount": 84.50,
            "category_id": food_cat["id"],
            "expense_date": "2026-05-18",
            "payment_method": "Credit Card",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "title": "Chevron Gas",
            "amount": 45.00,
            "category_id": trans_cat["id"],
            "expense_date": "2026-05-17",
            "payment_method": "Debit Card",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "title": "PG&E Electric",
            "amount": 135.20,
            "category_id": food_cat["id"],
            "expense_date": "2026-04-15",
            "payment_method": "Bank Transfer",
        },
    )

    # 1. Test basic list
    all_resp = client.get("/api/v1/expenses")
    assert all_resp.status_code == 200
    assert len(all_resp.json()) >= 3

    # 2. Test category filter
    cat_resp = client.get(f"/api/v1/expenses?category_id={trans_cat['id']}")
    assert cat_resp.status_code == 200
    assert all(e["category_id"] == trans_cat["id"] for e in cat_resp.json())

    # 3. Test date range filter
    date_resp = client.get("/api/v1/expenses?start_date=2026-05-01&end_date=2026-05-31")
    assert date_resp.status_code == 200
    assert all("2026-05" in e["expense_date"] for e in date_resp.json())

    # 4. Test payment method filter
    pm_resp = client.get("/api/v1/expenses?payment_method=Debit Card")
    assert pm_resp.status_code == 200
    assert all(e["payment_method"] == "Debit Card" for e in pm_resp.json())

    # 5. Test search filter
    search_resp = client.get("/api/v1/expenses?search=Chevron")
    assert search_resp.status_code == 200
    assert len(search_resp.json()) == 1
    assert "Chevron" in search_resp.json()[0]["title"]


def test_get_update_delete_expense(client):
    cats = client.get("/api/v1/categories").json()
    cat_id = cats[0]["id"]

    # Create
    create_resp = client.post(
        "/api/v1/expenses",
        json={
            "title": "Lunch Cafe",
            "amount": 15.00,
            "category_id": cat_id,
            "expense_date": "2026-05-18",
        },
    )
    exp_id = create_resp.json()["id"]

    # Get by ID
    get_resp = client.get(f"/api/v1/expenses/{exp_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Lunch Cafe"

    # Update
    update_resp = client.put(
        f"/api/v1/expenses/{exp_id}",
        json={"title": "Team Lunch Cafe", "amount": 22.50},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Team Lunch Cafe"
    assert update_resp.json()["amount"] == 22.50

    # Delete
    del_resp = client.delete(f"/api/v1/expenses/{exp_id}")
    assert del_resp.status_code == 204

    # Verify 404 after deletion
    assert client.get(f"/api/v1/expenses/{exp_id}").status_code == 404
