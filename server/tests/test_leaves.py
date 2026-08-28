def test_submit_leave_request_success(client):
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "VACATION",
        "start_date": "2026-07-06",  # Monday
        "end_date": "2026-07-10",  # Friday -> 5 business days
        "reason": "Summer Holiday Trip",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == payload["user_id"]
    assert data["leave_type"] == "VACATION"
    assert data["start_date"] == "2026-07-06"
    assert data["end_date"] == "2026-07-10"
    assert data["total_days"] == 5
    assert data["status"] == "PENDING"
    assert data["reason"] == "Summer Holiday Trip"
    assert data["manager_comment"] is None
    assert "id" in data


def test_submit_leave_calculates_business_days_excluding_weekends(client):
    # 2026-07-10 is Friday, 2026-07-13 is Monday -> Fri, Sat, Sun, Mon = 2 business days
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "PERSONAL",
        "start_date": "2026-07-17",  # Friday
        "end_date": "2026-07-20",  # Monday
        "reason": "Long weekend travel",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["total_days"] == 2


def test_submit_leave_weekend_only_fails(client):
    # 2026-07-11 is Saturday, 2026-07-12 is Sunday -> 0 business days
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "PERSONAL",
        "start_date": "2026-07-11",
        "end_date": "2026-07-12",
        "reason": "Weekend event",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 400
    assert "0 business days" in response.json()["detail"]


def test_submit_leave_invalid_date_range_fails(client):
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "VACATION",
        "start_date": "2026-08-10",
        "end_date": "2026-08-05",  # end before start
        "reason": "Invalid Dates",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 422


def test_submit_leave_insufficient_balance_fails(client):
    # User has 10 remaining vacation days for 2026
    # Asking for 15 business days (3 weeks)
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "VACATION",
        "start_date": "2026-09-07",
        "end_date": "2026-09-25",  # 15 business days
        "reason": "Exceeding Vacation",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 400
    assert "exceeds remaining" in response.json()["detail"]


def test_submit_leave_overlapping_request_fails(client):
    # Sample request is already seeded for 2026-06-01 to 2026-06-05
    payload = {
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "leave_type": "SICK",
        "start_date": "2026-06-03",
        "end_date": "2026-06-04",
        "reason": "Doctor visit",
    }
    response = client.post("/api/v1/leaves", json=payload)
    assert response.status_code == 400
    assert "Overlapping leave request" in response.json()["detail"]


def test_list_leave_requests_with_filters(client):
    user_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    # Filter by user_id and year
    response = client.get(f"/api/v1/leaves?user_id={user_id}&year=2026&skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1
    assert data["items"][0]["user_id"] == user_id


def test_list_leave_requests_by_manager(client):
    manager_id = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
    response = client.get(f"/api/v1/leaves?manager_id={manager_id}&status=PENDING")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for item in data["items"]:
        assert item["status"] == "PENDING"


def test_get_leave_request_by_id(client):
    sample_id = "c3a1e12f-876b-432a-9e12-32a11b987654"
    response = client.get(f"/api/v1/leaves/{sample_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_id
    assert data["status"] == "PENDING"


def test_get_leave_request_not_found(client):
    response = client.get("/api/v1/leaves/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_manager_approve_workflow_deducts_balance(client):
    user_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    # 1. Create a 3-day sick leave request
    req_payload = {
        "user_id": user_id,
        "leave_type": "SICK",
        "start_date": "2026-10-05",  # Mon
        "end_date": "2026-10-07",  # Wed -> 3 days
        "reason": "Flu recovery",
    }
    create_res = client.post("/api/v1/leaves", json=req_payload)
    assert create_res.status_code == 201
    leave_id = create_res.json()["id"]

    # Check sick balance before approval (was 1 used, 9 remaining)
    bal_res_before = client.get(f"/api/v1/balances/{user_id}?year=2026")
    sick_bal_before = next(
        b for b in bal_res_before.json()["balances"] if b["leave_type"] == "SICK"
    )
    used_before = sick_bal_before["used_days"]
    rem_before = sick_bal_before["remaining_days"]

    # 2. Manager approves request
    status_payload = {
        "status": "APPROVED",
        "manager_comment": "Approved. Get well soon!",
    }
    patch_res = client.patch(f"/api/v1/leaves/{leave_id}/status", json=status_payload)
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["status"] == "APPROVED"
    assert data["manager_comment"] == "Approved. Get well soon!"

    # 3. Verify sick balance updated (+3 used, -3 remaining)
    bal_res_after = client.get(f"/api/v1/balances/{user_id}?year=2026")
    sick_bal_after = next(
        b for b in bal_res_after.json()["balances"] if b["leave_type"] == "SICK"
    )
    assert sick_bal_after["used_days"] == used_before + 3
    assert sick_bal_after["remaining_days"] == rem_before - 3

    # 4. Finalized request cannot be altered again
    second_patch = client.patch(
        f"/api/v1/leaves/{leave_id}/status",
        json={"status": "REJECTED", "manager_comment": "Too late"},
    )
    assert second_patch.status_code == 400
    assert "finalized" in second_patch.json()["detail"]


def test_manager_reject_workflow_requires_comment(client):
    user_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    # Create request
    req_payload = {
        "user_id": user_id,
        "leave_type": "PERSONAL",
        "start_date": "2026-11-02",  # Mon
        "end_date": "2026-11-03",  # Tue -> 2 days
        "reason": "Personal errands",
    }
    create_res = client.post("/api/v1/leaves", json=req_payload)
    assert create_res.status_code == 201
    leave_id = create_res.json()["id"]

    # Rejection without comment should fail validation (422)
    invalid_reject = client.patch(
        f"/api/v1/leaves/{leave_id}/status", json={"status": "REJECTED"}
    )
    assert invalid_reject.status_code == 422

    # Rejection with comment succeeds
    valid_reject = client.patch(
        f"/api/v1/leaves/{leave_id}/status",
        json={
            "status": "REJECTED",
            "manager_comment": "Team sprint critical milestone; please reschedule.",
        },
    )
    assert valid_reject.status_code == 200
    assert valid_reject.json()["status"] == "REJECTED"
    assert (
        valid_reject.json()["manager_comment"]
        == "Team sprint critical milestone; please reschedule."
    )
