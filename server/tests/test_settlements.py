# Test cases for Debt Calculation and Simplified Settlements


def _setup_group(client):
    res = client.post(
        "/api/v1/groups",
        json={
            "name": "Vacation Group",
            "members": [
                {"name": "Alice", "email": "alice@example.com"},
                {"name": "Bob", "email": "bob@example.com"},
                {"name": "Charlie", "email": "charlie@example.com"},
            ],
        },
    )
    group = res.json()
    members_by_name = {m["name"]: m["id"] for m in group["members"]}
    return group["id"], members_by_name


def test_settlements_single_equal_expense(client):
    # AC: If Bob owes Alice $40 and Charlie owes Alice $20 (e.g. Alice paid for Bob $40 and Charlie $20)
    # Let's test a $120 dinner paid by Alice, split equally ($40 each)
    # Alice paid 120, owes 40 -> Net Alice: +80
    # Bob paid 0, owes 40 -> Net Bob: -40
    # Charlie paid 0, owes 40 -> Net Charlie: -40
    # Settlements: Bob owes Alice $40, Charlie owes Alice $40
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    client.post(
        "/api/v1/expenses",
        json={
            "group_id": group_id,
            "title": "Dinner at Bistro",
            "total_amount": 120.00,
            "payer_id": alice_id,
            "split_type": "EQUAL",
            "splits": [
                {"member_id": alice_id},
                {"member_id": bob_id},
                {"member_id": charlie_id},
            ],
        },
    )

    response = client.get(f"/api/v1/groups/{group_id}/settlements")
    assert response.status_code == 200
    data = response.json()
    assert data["group_id"] == group_id

    balances = {b["member_name"]: b["net_balance"] for b in data["balances"]}
    assert balances["Alice"] == 80.00
    assert balances["Bob"] == -40.00
    assert balances["Charlie"] == -40.00

    settlements = data["settlements"]
    assert len(settlements) == 2
    bob_settle = next((s for s in settlements if s["from_member"] == "Bob"), None)
    charlie_settle = next(
        (s for s in settlements if s["from_member"] == "Charlie"), None
    )

    assert bob_settle is not None
    assert bob_settle["to_member"] == "Alice"
    assert bob_settle["amount"] == 40.00

    assert charlie_settle is not None
    assert charlie_settle["to_member"] == "Alice"
    assert charlie_settle["amount"] == 40.00


def test_settlements_multiple_expenses_simplified_plan(client):
    # AC: The system aggregates all group expenses to calculate individual net balances
    # Expense 1: Alice pays $100 for Alice and Bob ($50 each) -> Alice +50, Bob -50
    # Expense 2: Bob pays $60 for Bob and Charlie ($30 each) -> Bob +30, Charlie -30
    # Net balances:
    # Alice: +50
    # Bob: -50 + 30 = -20
    # Charlie: -30
    # Simplified settlements:
    # Charlie pays Alice $30, Bob pays Alice $20 (total Alice gets $50, net all 0)
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    # Expense 1
    client.post(
        "/api/v1/expenses",
        json={
            "group_id": group_id,
            "title": "Groceries",
            "total_amount": 100.00,
            "payer_id": alice_id,
            "split_type": "EQUAL",
            "splits": [
                {"member_id": alice_id},
                {"member_id": bob_id},
            ],
        },
    )

    # Expense 2
    client.post(
        "/api/v1/expenses",
        json={
            "group_id": group_id,
            "title": "Movie Tickets",
            "total_amount": 60.00,
            "payer_id": bob_id,
            "split_type": "EQUAL",
            "splits": [
                {"member_id": bob_id},
                {"member_id": charlie_id},
            ],
        },
    )

    response = client.get(f"/api/v1/groups/{group_id}/settlements")
    assert response.status_code == 200
    data = response.json()

    balances = {b["member_name"]: b["net_balance"] for b in data["balances"]}
    assert balances["Alice"] == 50.00
    assert balances["Bob"] == -20.00
    assert balances["Charlie"] == -30.00

    settlements = data["settlements"]
    assert len(settlements) == 2
    # Verify all transfers go to Alice and sum to 50
    total_to_alice = sum(s["amount"] for s in settlements if s["to_member"] == "Alice")
    assert total_to_alice == 50.00


def test_settlements_empty_expenses_returns_zero_balances(client):
    # AC: Handling empty group expense lists gracefully
    group_id, members = _setup_group(client)
    response = client.get(f"/api/v1/groups/{group_id}/settlements")
    assert response.status_code == 200
    data = response.json()
    assert len(data["settlements"]) == 0
    for b in data["balances"]:
        assert b["net_balance"] == 0.00


def test_settlements_nonexistent_group_returns_404(client):
    response = client.get(
        "/api/v1/groups/00000000-0000-0000-0000-000000000000/settlements"
    )
    assert response.status_code == 404
