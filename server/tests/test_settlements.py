def setup_expense_scenario(client):
    """
    Scenario:
    User A pays $120 for Dinner split equally among User A, User B, User C ($40 each).
    Net Balances:
    - User A: paid 120, share 40 => +80.00
    - User B: paid 0, share 40 => -40.00
    - User C: paid 0, share 40 => -40.00
    """
    group_res = client.post("/api/v1/groups", json={"name": "Vacation Split"})
    group_id = group_res.json()["id"]

    m1_res = client.post(
        f"/api/v1/groups/{group_id}/members", json={"name": "User A", "email": "a@example.com"}
    )
    m2_res = client.post(
        f"/api/v1/groups/{group_id}/members", json={"name": "User B", "email": "b@example.com"}
    )
    m3_res = client.post(
        f"/api/v1/groups/{group_id}/members", json={"name": "User C", "email": "c@example.com"}
    )

    u1 = m1_res.json()["id"]
    u2 = m2_res.json()["id"]
    u3 = m3_res.json()["id"]

    client.post(
        "/api/v1/expenses",
        json={
            "group_id": group_id,
            "title": "Group Dinner",
            "total_amount": 120.00,
            "payer_id": u1,
            "split_type": "EQUAL",
            "date": "2026-09-02",
            "category": "Dining",
            "splits": [{"member_id": u1}, {"member_id": u2}, {"member_id": u3}],
        },
    )

    return group_id, u1, u2, u3


def test_group_balances_calculation(client):
    group_id, u1, u2, u3 = setup_expense_scenario(client)

    res = client.get(f"/api/v1/groups/{group_id}/balances")
    assert res.status_code == 200
    data = res.json()
    assert data["group_id"] == group_id

    balances = {b["member_id"]: b["net_balance"] for b in data["net_balances"]}
    assert balances[u1] == 80.00
    assert balances[u2] == -40.00
    assert balances[u3] == -40.00

    simplified = data["simplified_settlements"]
    assert len(simplified) == 2
    # Both B and C should owe A $40
    for item in simplified:
        assert item["to_member_id"] == u1
        assert item["amount"] == 40.00
        assert item["from_member_id"] in [u2, u3]


def test_record_settlement_updates_balance(client):
    group_id, u1, u2, u3 = setup_expense_scenario(client)

    # User B transfers $40 to User A and logs a settlement
    settle_payload = {
        "group_id": group_id,
        "payer_id": u2,
        "payee_id": u1,
        "amount": 40.00,
        "date": "2026-09-02",
        "notes": "Reimbursement for Italian dinner",
    }
    settle_res = client.post("/api/v1/settlements", json=settle_payload)
    assert settle_res.status_code == 201
    settle_data = settle_res.json()
    assert settle_data["amount"] == 40.00
    assert settle_data["payer_id"] == u2
    assert settle_data["payee_id"] == u1

    # Check updated balances
    bal_res = client.get(f"/api/v1/groups/{group_id}/balances")
    assert bal_res.status_code == 200
    updated_balances = {b["member_id"]: b["net_balance"] for b in bal_res.json()["net_balances"]}

    assert updated_balances[u2] == 0.00  # User B settled up!
    assert updated_balances[u1] == 40.00  # User A is now owed 40 (by User C)
    assert updated_balances[u3] == -40.00  # User C still owes 40


def test_settlement_with_same_payer_and_payee_fails(client):
    group_id, u1, _, _ = setup_expense_scenario(client)

    settle_payload = {
        "group_id": group_id,
        "payer_id": u1,
        "payee_id": u1,
        "amount": 25.00,
        "date": "2026-09-02",
    }
    res = client.post("/api/v1/settlements", json=settle_payload)
    assert res.status_code == 400
    assert "cannot be the same" in res.json()["detail"].lower()


def test_list_group_settlements(client):
    group_id, u1, u2, _ = setup_expense_scenario(client)

    client.post(
        "/api/v1/settlements",
        json={
            "group_id": group_id,
            "payer_id": u2,
            "payee_id": u1,
            "amount": 40.00,
            "date": "2026-09-02",
            "notes": "Settled via Venmo",
        },
    )

    res = client.get(f"/api/v1/groups/{group_id}/settlements")
    assert res.status_code == 200
    settlements = res.json()
    assert len(settlements) == 1
    assert settlements[0]["amount"] == 40.00
    assert settlements[0]["notes"] == "Settled via Venmo"


def test_health_endpoints(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"
