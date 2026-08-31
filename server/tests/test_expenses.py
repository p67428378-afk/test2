# Test cases for Expense Management and Split Calculations


def _setup_group(client):
    res = client.post(
        "/api/v1/groups",
        json={
            "name": "Dinner Group",
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


def test_create_expense_equal_split(client):
    # AC: User enters a "$120 Dinner" expense paid by Alice, split equally among Alice, Bob, and Charlie ($40 each).
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    payload = {
        "group_id": group_id,
        "title": "Dinner at Bistro",
        "total_amount": 120.00,
        "payer_id": alice_id,
        "category": "Food & Dining",
        "split_type": "EQUAL",
        "splits": [
            {"member_id": alice_id},
            {"member_id": bob_id},
            {"member_id": charlie_id},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Dinner at Bistro"
    assert data["total_amount"] == 120.00
    assert data["payer_id"] == alice_id
    assert data["payer_name"] == "Alice"
    assert len(data["splits"]) == 3

    for split in data["splits"]:
        assert split["computed_amount"] == 40.00


def test_create_expense_equal_split_penny_allocation(client):
    # AC: Edge Cases - rounding off fractional cents in split amounts
    # $100 split 3 ways = $33.34 + $33.33 + $33.33 = $100.00
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    payload = {
        "group_id": group_id,
        "title": "Hotel Stay",
        "total_amount": 100.00,
        "payer_id": alice_id,
        "category": "Accommodation",
        "split_type": "EQUAL",
        "splits": [
            {"member_id": alice_id},
            {"member_id": bob_id},
            {"member_id": charlie_id},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    total_computed = sum(s["computed_amount"] for s in data["splits"])
    assert round(total_computed, 2) == 100.00


def test_create_expense_percentage_split(client):
    # AC: For a $100 expense, splitting 50% to Alice ($50), 30% to Bob ($30), and 20% to Charlie ($20) validates to 100%.
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    payload = {
        "group_id": group_id,
        "title": "Grocery Shopping",
        "total_amount": 100.00,
        "payer_id": alice_id,
        "category": "Groceries",
        "split_type": "PERCENTAGE",
        "splits": [
            {"member_id": alice_id, "split_value": 50.0},
            {"member_id": bob_id, "split_value": 30.0},
            {"member_id": charlie_id, "split_value": 20.0},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    splits_dict = {s["member_id"]: s["computed_amount"] for s in data["splits"]}
    assert splits_dict[alice_id] == 50.00
    assert splits_dict[bob_id] == 30.00
    assert splits_dict[charlie_id] == 20.00


def test_create_expense_percentage_split_mismatch_fails(client):
    # AC: Entering a custom split summing to 90% displays a validation message.
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]

    payload = {
        "group_id": group_id,
        "title": "Taxi",
        "total_amount": 50.00,
        "payer_id": alice_id,
        "split_type": "PERCENTAGE",
        "splits": [
            {"member_id": alice_id, "split_value": 50.0},
            {"member_id": bob_id, "split_value": 40.0},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 400
    assert "100" in response.json()["detail"]


def test_create_expense_fixed_split(client):
    # AC: Fixed amount split per participant
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]
    charlie_id = members["Charlie"]

    payload = {
        "group_id": group_id,
        "title": "Car Rental",
        "total_amount": 150.00,
        "payer_id": alice_id,
        "category": "Transportation",
        "split_type": "FIXED",
        "splits": [
            {"member_id": alice_id, "split_value": 75.00},
            {"member_id": bob_id, "split_value": 50.00},
            {"member_id": charlie_id, "split_value": 25.00},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 201
    data = response.json()
    splits_dict = {s["member_id"]: s["computed_amount"] for s in data["splits"]}
    assert splits_dict[alice_id] == 75.00
    assert splits_dict[bob_id] == 50.00
    assert splits_dict[charlie_id] == 25.00


def test_create_expense_fixed_split_mismatch_fails(client):
    # AC: Fixed split total mismatch rejection
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]

    payload = {
        "group_id": group_id,
        "title": "Concert Tickets",
        "total_amount": 100.00,
        "payer_id": alice_id,
        "split_type": "FIXED",
        "splits": [
            {"member_id": alice_id, "split_value": 40.00},
            {"member_id": bob_id, "split_value": 40.00},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 400
    assert "equal total expense amount" in response.json()["detail"]


def test_create_expense_negative_amount_fails(client):
    # AC: Input validation blocks negative expense amounts
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]

    payload = {
        "group_id": group_id,
        "title": "Invalid Expense",
        "total_amount": -50.00,
        "payer_id": alice_id,
        "split_type": "EQUAL",
        "splits": [{"member_id": alice_id}],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code in [400, 422]


def test_create_expense_zero_amount_fails(client):
    # AC: Reject zero-amount expenses
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]

    payload = {
        "group_id": group_id,
        "title": "Zero Expense",
        "total_amount": 0.00,
        "payer_id": alice_id,
        "split_type": "EQUAL",
        "splits": [{"member_id": alice_id}],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code in [400, 422]


def test_create_expense_duplicate_participant_fails(client):
    # AC: Input validation blocks duplicate members in split
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]

    payload = {
        "group_id": group_id,
        "title": "Duplicate Member Expense",
        "total_amount": 60.00,
        "payer_id": alice_id,
        "split_type": "EQUAL",
        "splits": [
            {"member_id": alice_id},
            {"member_id": alice_id},
        ],
    }

    response = client.post("/api/v1/expenses", json=payload)
    assert response.status_code == 400
    assert "duplicate" in response.json()["detail"].lower()


def test_list_expenses_and_filter_by_group(client):
    # AC: List group expenses with pagination
    group_id, members = _setup_group(client)
    alice_id = members["Alice"]
    bob_id = members["Bob"]

    client.post(
        "/api/v1/expenses",
        json={
            "group_id": group_id,
            "title": "Lunch",
            "total_amount": 30.00,
            "payer_id": alice_id,
            "split_type": "EQUAL",
            "splits": [{"member_id": alice_id}, {"member_id": bob_id}],
        },
    )

    response = client.get(f"/api/v1/expenses?group_id={group_id}")
    assert response.status_code == 200
    expenses = response.json()
    assert len(expenses) == 1
    assert expenses[0]["title"] == "Lunch"
    assert expenses[0]["payer_name"] == "Alice"
    assert len(expenses[0]["splits"]) == 2
