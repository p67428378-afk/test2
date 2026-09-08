from fastapi import status


def test_dashboard_summary(client):
    # Add expenses across multiple categories
    expenses = [
        {
            "amount": 100.0,
            "category": "Food & Dining",
            "date": "2026-05-01",
            "description": "Dinner",
        },
        {
            "amount": 50.0,
            "category": "Food & Dining",
            "date": "2026-05-02",
            "description": "Lunch",
        },
        {
            "amount": 200.0,
            "category": "Housing/Utilities",
            "date": "2026-05-03",
            "description": "Water bill",
        },
    ]
    for exp in expenses:
        client.post("/api/v1/expenses", json=exp)

    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert "total_expenses" in data
    assert data["total_expenses"] >= 350.0
    assert "total_count" in data
    assert data["total_count"] >= 3
    assert "by_category" in data
    assert isinstance(data["by_category"], list)
    assert len(data["by_category"]) >= 2

    # Verify top category or category totals
    categories = [cat["category"] for cat in data["by_category"]]
    assert "Food & Dining" in categories or "Housing/Utilities" in categories


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "ok"
