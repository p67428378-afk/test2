def create_sample_group_with_members(client):
    group_res = client.post("/api/v1/groups", json={"name": "Dinner Group"})
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

    return (
        group_id,
        m1_res.json()["id"],
        m2_res.json()["id"],
        m3_res.json()["id"],
    )


def test_create_equal_split_expense(client):
    group_id, u1, u2, u3 = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Italian Dinner",
        "total_amount": 120.00,
        "payer_id": u1,
        "split_type": "EQUAL",
        "date": "2026-09-02",
        "category": "Dining",
        "description": "Team dinner at Italian Bistro",
        "splits": [
            {"member_id": u1},
            {"member_id": u2},
            {"member_id": u3},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Italian Dinner"
    assert data["total_amount"] == 120.00
    assert len(data["splits"]) == 3

    for split in data["splits"]:
        assert split["share_amount"] == 40.00
        assert split["percentage"] == 33.33


def test_equal_split_with_penny_rounding(client):
    group_id, u1, u2, u3 = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Grocery Run",
        "total_amount": 100.00,
        "payer_id": u1,
        "split_type": "EQUAL",
        "date": "2026-09-02",
        "category": "Groceries",
        "splits": [
            {"member_id": u1},
            {"member_id": u2},
            {"member_id": u3},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 201
    data = res.json()
    shares = [s["share_amount"] for s in data["splits"]]
    # Sum of shares must equal exactly $100.00
    assert round(sum(shares), 2) == 100.00
    assert 33.34 in shares
    assert 33.33 in shares


def test_create_exact_split_expense(client):
    group_id, u1, u2, u3 = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Concert Tickets",
        "total_amount": 150.00,
        "payer_id": u2,
        "split_type": "EXACT",
        "date": "2026-09-02",
        "category": "Entertainment",
        "splits": [
            {"member_id": u1, "share_amount": 50.00},
            {"member_id": u2, "share_amount": 60.00},
            {"member_id": u3, "share_amount": 40.00},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["total_amount"] == 150.00
    assert len(data["splits"]) == 3


def test_exact_split_mismatch_fails(client):
    group_id, u1, u2, _ = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Bad Split",
        "total_amount": 100.00,
        "payer_id": u1,
        "split_type": "EXACT",
        "date": "2026-09-02",
        "splits": [
            {"member_id": u1, "share_amount": 40.00},
            {"member_id": u2, "share_amount": 50.00},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 400
    assert "must equal total amount" in res.json()["detail"].lower()


def test_create_percentage_split_expense(client):
    group_id, u1, u2, _ = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Cab Ride",
        "total_amount": 100.00,
        "payer_id": u1,
        "split_type": "PERCENTAGE",
        "date": "2026-09-02",
        "category": "Travel",
        "splits": [
            {"member_id": u1, "percentage": 60.0},
            {"member_id": u2, "percentage": 40.0},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 201
    data = res.json()
    shares = {s["member_id"]: s["share_amount"] for s in data["splits"]}
    assert shares[u1] == 60.00
    assert shares[u2] == 40.00


def test_percentage_split_invalid_sum_fails(client):
    group_id, u1, u2, _ = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Cab Ride",
        "total_amount": 100.00,
        "payer_id": u1,
        "split_type": "PERCENTAGE",
        "date": "2026-09-02",
        "splits": [
            {"member_id": u1, "percentage": 50.0},
            {"member_id": u2, "percentage": 40.0},
        ],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 400
    assert "must equal 100%" in res.json()["detail"]


def test_invalid_payer_fails(client):
    group_id, _, _, _ = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Lunch",
        "total_amount": 50.00,
        "payer_id": "invalid-payer-id",
        "split_type": "EQUAL",
        "date": "2026-09-02",
        "splits": [],
    }

    res = client.post("/api/v1/expenses", json=payload)
    assert res.status_code == 422 or res.status_code == 400


def test_list_and_get_expense(client):
    group_id, u1, u2, _ = create_sample_group_with_members(client)

    payload = {
        "group_id": group_id,
        "title": "Coffee",
        "total_amount": 20.00,
        "payer_id": u1,
        "split_type": "EQUAL",
        "date": "2026-09-02",
        "splits": [{"member_id": u1}, {"member_id": u2}],
    }

    create_res = client.post("/api/v1/expenses", json=payload)
    exp_id = create_res.json()["id"]

    # List expenses filtered by group
    list_res = client.get(f"/api/v1/expenses?group_id={group_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Get single expense
    get_res = client.get(f"/api/v1/expenses/{exp_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == exp_id
