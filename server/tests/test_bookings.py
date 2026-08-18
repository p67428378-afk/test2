def get_user_token(client, email, password):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    return res.json()["access_token"]


def test_booking_capacity_control(client):
    admin_token = get_user_token(client, "admin@example.com", "adminpassword")
    visitor_token = get_user_token(client, "test@example.com", "testpassword")

    # Get sample tour
    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    # Create a schedule with max_capacity = 3
    sched_res = client.post(
        "/api/v1/schedules",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "tour_id": tour_id,
            "start_time": "2026-10-15T14:00:00",
            "max_capacity": 3,
        },
    )
    assert sched_res.status_code == 201
    schedule_id = sched_res.json()["id"]

    # Attempt to book 5 tickets when capacity is 3
    fail_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {visitor_token}"},
        json={
            "schedule_id": schedule_id,
            "ticket_count": 5,
        },
    )
    assert fail_res.status_code == 400
    assert "Cannot book 5 tickets. Only 3 spots remaining." in fail_res.json()["detail"]

    # Book 2 tickets (successful)
    success_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {visitor_token}"},
        json={
            "schedule_id": schedule_id,
            "ticket_count": 2,
        },
    )
    assert success_res.status_code == 201
    booking_data = success_res.json()
    assert booking_data["ticket_count"] == 2
    assert booking_data["status"] == "Confirmed"

    # Verify remaining capacity is now 1
    sched_check = client.get(f"/api/v1/schedules/{schedule_id}")
    assert sched_check.json()["remaining_capacity"] == 1


def test_my_bookings(client):
    visitor_token = get_user_token(client, "test@example.com", "testpassword")
    res = client.get(
        "/api/v1/bookings/my-bookings",
        headers={"Authorization": f"Bearer {visitor_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
