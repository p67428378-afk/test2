import uuid
from fastapi import status


def test_create_expense(client):
    payload = {
        "amount": 49.99,
        "category": "Food & Dining",
        "date": "2026-05-18",
        "description": "Lunch with team",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["amount"] == 49.99
    assert data["category"] == "Food & Dining"
    assert data["date"] == "2026-05-18"
    assert data["description"] == "Lunch with team"
    assert "id" in data


def test_create_expense_validation_error(client):
    # Invalid amount <= 0
    payload = {
        "amount": -10.0,
        "category": "Food & Dining",
        "date": "2026-05-18",
        "description": "Invalid expense",
    }
    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_list_expenses(client):
    # Create an expense
    client.post(
        "/api/v1/expenses",
        json={
            "amount": 20.0,
            "category": "Transportation",
            "date": "2026-05-18",
            "description": "Bus ticket",
        },
    )

    response = client.get("/api/v1/expenses")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_expense_by_id(client):
    res_create = client.post(
        "/api/v1/expenses",
        json={
            "amount": 100.0,
            "category": "Shopping",
            "date": "2026-05-18",
            "description": "Shoes",
        },
    )
    expense_id = res_create.json()["id"]

    response = client.get(f"/api/v1/expenses/{expense_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == expense_id


def test_get_expense_not_found(client):
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/expenses/{random_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_expense(client):
    res_create = client.post(
        "/api/v1/expenses",
        json={
            "amount": 150.0,
            "category": "Entertainment",
            "date": "2026-05-18",
            "description": "Concert ticket",
        },
    )
    expense_id = res_create.json()["id"]

    update_payload = {"amount": 180.0, "description": "VIP Concert ticket"}
    response = client.put(f"/api/v1/expenses/{expense_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["amount"] == 180.0
    assert data["description"] == "VIP Concert ticket"
    assert data["category"] == "Entertainment"  # unchanged


def test_delete_expense(client):
    res_create = client.post(
        "/api/v1/expenses",
        json={
            "amount": 30.0,
            "category": "Miscellaneous",
            "date": "2026-05-18",
            "description": "Coffee",
        },
    )
    expense_id = res_create.json()["id"]

    res_delete = client.delete(f"/api/v1/expenses/{expense_id}")
    assert res_delete.status_code == status.HTTP_204_NO_CONTENT

    res_get = client.get(f"/api/v1/expenses/{expense_id}")
    assert res_get.status_code == status.HTTP_404_NOT_FOUND
