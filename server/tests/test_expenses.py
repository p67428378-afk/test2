from datetime import date


def test_expense_crud_workflow(client):
    # 1. Fetch categories to get a valid category_id
    cat_resp = client.get("/api/v1/categories")
    assert cat_resp.status_code == 200
    categories = cat_resp.json()
    food_cat = next(c for c in categories if c["name"] == "Food & Dining")

    # 2. Create expense
    expense_payload = {
        "amount": 45.50,
        "date": "2026-02-15",
        "category_id": food_cat["id"],
        "payment_method": "Credit Card",
        "description": "Weekly grocery shopping"
    }
    create_resp = client.post("/api/v1/expenses", json=expense_payload)
    assert create_resp.status_code == 201
    created_expense = create_resp.json()
    expense_id = created_expense["id"]
    assert created_expense["amount"] == 45.50
    assert created_expense["category_name"] == "Food & Dining"
    assert created_expense["description"] == "Weekly grocery shopping"

    # 3. Get expense by ID
    get_resp = client.get(f"/api/v1/expenses/{expense_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == expense_id

    # 4. List expenses with filter
    list_resp = client.get(f"/api/v1/expenses?category_id={food_cat['id']}")
    assert list_resp.status_code == 200
    expenses_list = list_resp.json()
    assert any(e["id"] == expense_id for e in expenses_list)

    # 5. Update expense
    update_payload = {
        "amount": 50.00,
        "description": "Weekly grocery shopping - updated"
    }
    put_resp = client.put(f"/api/v1/expenses/{expense_id}", json=update_payload)
    assert put_resp.status_code == 200
    updated_expense = put_resp.json()
    assert updated_expense["amount"] == 50.00
    assert updated_expense["description"] == "Weekly grocery shopping - updated"

    # 6. Delete expense
    del_resp = client.delete(f"/api/v1/expenses/{expense_id}")
    assert del_resp.status_code == 204

    # Confirm deletion
    get_after_del = client.get(f"/api/v1/expenses/{expense_id}")
    assert get_after_del.status_code == 404


def test_create_expense_invalid_category(client):
    expense_payload = {
        "amount": 20.00,
        "date": "2026-02-15",
        "category_id": "non-existent-uuid",
        "payment_method": "Cash",
        "description": "Coffee"
    }
    resp = client.post("/api/v1/expenses", json=expense_payload)
    assert resp.status_code == 404
    assert "not found" in resp.json()["detail"]


def test_create_expense_invalid_amount(client):
    cat_resp = client.get("/api/v1/categories")
    categories = cat_resp.json()
    
    expense_payload = {
        "amount": -10.00,  # Invalid non-positive amount
        "date": "2026-02-15",
        "category_id": categories[0]["id"],
        "payment_method": "Cash",
        "description": "Invalid"
    }
    resp = client.post("/api/v1/expenses", json=expense_payload)
    assert resp.status_code == 422  # Unprocessable Entity from Pydantic validation
