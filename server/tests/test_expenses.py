def test_create_expense(client):
    # Get category ID
    cats = client.get("/api/v1/categories").json()
    category_id = cats[0]["id"]

    payload = {
        "amount": 45.50,
        "date": "2026-05-18",
        "category_id": category_id,
        "payment_method": "Credit Card",
        "description": "Groceries at Supermarket",
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 45.50
    assert data["category_id"] == category_id
    assert data["category_name"] == cats[0]["name"]
    assert "id" in data


def test_create_expense_invalid_category_fails(client):
    payload = {
        "amount": 20.00,
        "date": "2026-05-18",
        "category_id": "invalid-uuid-12345",
        "payment_method": "Cash",
        "description": "Coffee",
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 400


def test_create_expense_invalid_amount_fails(client):
    cats = client.get("/api/v1/categories").json()
    category_id = cats[0]["id"]

    payload = {"amount": -10.00, "date": "2026-05-18", "category_id": category_id}

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_list_expenses_with_filters(client):
    cats = client.get("/api/v1/categories").json()
    cat_id = cats[0]["id"]

    # Create 2 expenses
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.0,
            "date": "2026-05-01",
            "category_id": cat_id,
            "description": "Lunch",
        },
    )
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 50.0,
            "date": "2026-05-10",
            "category_id": cat_id,
            "description": "Dinner",
        },
    )

    res = client.get(f"/api/v1/expenses?category_id={cat_id}&search=Lunch")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["description"] == "Lunch"


def test_update_and_delete_expense(client):
    cats = client.get("/api/v1/categories").json()
    cat_id = cats[0]["id"]

    create_res = client.post(
        "/api/v1/expenses",
        json={
            "amount": 15.0,
            "date": "2026-05-15",
            "category_id": cat_id,
            "description": "Taxi",
        },
    )
    exp_id = create_res.json()["id"]

    update_res = client.put(f"/api/v1/expenses/{exp_id}", json={"amount": 25.0})
    assert update_res.status_code == 200
    assert update_res.json()["amount"] == 25.0

    del_res = client.delete(f"/api/v1/expenses/{exp_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/expenses/{exp_id}")
    assert get_res.status_code == 404
