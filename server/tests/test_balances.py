def test_get_user_balances_seeded(client):
    user_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    response = client.get(f"/api/v1/balances/{user_id}?year=2026")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["year"] == 2026
    assert len(data["balances"]) == 4

    balance_map = {b["leave_type"]: b for b in data["balances"]}
    assert "VACATION" in balance_map
    assert "SICK" in balance_map
    assert "PERSONAL" in balance_map
    assert "UNPAID" in balance_map

    assert balance_map["VACATION"]["allocated_days"] == 15
    assert balance_map["VACATION"]["used_days"] == 5
    assert balance_map["VACATION"]["remaining_days"] == 10

    assert balance_map["SICK"]["allocated_days"] == 10
    assert balance_map["SICK"]["used_days"] == 1
    assert balance_map["SICK"]["remaining_days"] == 9


def test_get_user_balances_auto_initializes_for_new_year(client):
    user_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    response = client.get(f"/api/v1/balances/{user_id}?year=2027")
    assert response.status_code == 200
    data = response.json()
    assert data["year"] == 2027

    balance_map = {b["leave_type"]: b for b in data["balances"]}
    assert balance_map["VACATION"]["allocated_days"] == 15
    assert balance_map["VACATION"]["used_days"] == 0
    assert balance_map["VACATION"]["remaining_days"] == 15


def test_get_balances_user_not_found(client):
    response = client.get(
        "/api/v1/balances/00000000-0000-0000-0000-000000000000?year=2026"
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
