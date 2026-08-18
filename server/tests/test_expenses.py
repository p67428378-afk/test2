import pytest


def _get_first_category_id(client):
    res = client.get("/api/v1/categories")
    assert res.status_code == 200
    categories = res.json()
    assert len(categories) > 0
    return categories[0]["id"], categories[0]["name"]


def test_create_and_get_expense(client):
    cat_id, cat_name = _get_first_category_id(client)

    payload = {
        "amount": 45.50,
        "date": "2026-08-18",
        "category_id": cat_id,
        "payment_method": "Credit Card",
        "description": "Weekly grocery shopping",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 45.50
    assert data["date"] == "2026-08-18"
    assert data["category_id"] == cat_id
    assert data["category_name"] == cat_name
    assert data["payment_method"] == "Credit Card"

    expense_id = data["id"]
    get_res = client.get(f"/api/v1/expenses/{expense_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == expense_id


def test_list_expenses_with_filters(client):
    cat_id, _ = _get_first_category_id(client)

    # Create an expense
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 15.00,
            "date": "2026-08-01",
            "category_id": cat_id,
            "payment_method": "Cash",
            "description": "Lunch box",
        },
    )

    response = client.get(
        f"/api/v1/expenses?category_id={cat_id}&start_date=2026-08-01&end_date=2026-08-31"
    )
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)
    assert data["total"] >= 1


def test_expense_summary(client):
    cat_id, _ = _get_first_category_id(client)

    # Add known expense for summary testing
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.00,
            "date": "2026-08-10",
            "category_id": cat_id,
            "payment_method": "Debit Card",
            "description": "Dinner party",
        },
    )

    response = client.get("/api/v1/expenses/summary?start_date=2026-08-01&end_date=2026-08-31")
    assert response.status_code == 200
    data = response.json()
    assert "total_expense" in data
    assert data["total_expense"] > 0
    assert "by_category" in data
    assert isinstance(data["by_category"], list)


def test_update_expense(client):
    cat_id, _ = _get_first_category_id(client)

    create_res = client.post(
        "/api/v1/expenses",
        json={
            "amount": 25.00,
            "date": "2026-08-05",
            "category_id": cat_id,
            "payment_method": "Cash",
            "description": "Taxi ride",
        },
    )
    expense_id = create_res.json()["id"]

    update_payload = {
        "amount": 30.00,
        "description": "Taxi ride with tip",
    }
    update_res = client.put(f"/api/v1/expenses/{expense_id}", json=update_payload)
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["amount"] == 30.00
    assert data["description"] == "Taxi ride with tip"


def test_delete_expense(client):
    cat_id, _ = _get_first_category_id(client)

    create_res = client.post(
        "/api/v1/expenses",
        json={
            "amount": 5.00,
            "date": "2026-08-02",
            "category_id": cat_id,
            "payment_method": "Cash",
            "description": "Coffee",
        },
    )
    expense_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/expenses/{expense_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/expenses/{expense_id}")
    assert get_res.status_code == 404


def test_invalid_expense_creation(client):
    # Non-existent category
    res_cat = client.post(
        "/api/v1/expenses",
        json={
            "amount": 50.00,
            "date": "2026-08-01",
            "category_id": "00000000-0000-0000-0000-000000000000",
            "payment_method": "Cash",
        },
    )
    assert res_cat.status_code == 404

    # Negative amount
    cat_id, _ = _get_first_category_id(client)
    res_amt = client.post(
        "/api/v1/expenses",
        json={
            "amount": -10.00,
            "date": "2026-08-01",
            "category_id": cat_id,
            "payment_method": "Cash",
        },
    )
    assert res_amt.status_code == 422  # Pydantic validation error (gt=0)
