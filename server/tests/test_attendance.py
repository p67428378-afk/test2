def get_user_token(client, email, password):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    return res.json()["access_token"]


def test_attendance_and_check_in(client):
    admin_token = get_user_token(client, "admin@example.com", "adminpassword")
    guide_token = get_user_token(client, "guide@example.com", "guidepassword")
    visitor_token = get_user_token(client, "test@example.com", "testpassword")

    # Get sample tour
    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    # Create schedule
    sched_res = client.post(
        "/api/v1/schedules",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "tour_id": tour_id,
            "start_time": "2026-10-20T10:00:00",
            "max_capacity": 10,
        },
    )
    schedule_id = sched_res.json()["id"]

    # Book tour as visitor
    book_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {visitor_token}"},
        json={"schedule_id": schedule_id, "ticket_count": 2},
    )
    booking_id = book_res.json()["id"]

    # Guide gets attendance sheet
    att_sheet_res = client.get(
        f"/api/v1/attendance/schedule/{schedule_id}",
        headers={"Authorization": f"Bearer {guide_token}"},
    )
    assert att_sheet_res.status_code == 200
    att_sheet = att_sheet_res.json()
    assert len(att_sheet) >= 1
    assert att_sheet[0]["status"] == "Unchecked"

    # Guide performs check-in
    checkin_res = client.post(
        "/api/v1/attendance/check-in",
        headers={"Authorization": f"Bearer {guide_token}"},
        json={"booking_id": booking_id, "status": "Checked-in"},
    )
    assert checkin_res.status_code == 200
    att_data = checkin_res.json()
    assert att_data["status"] == "Checked-in"
    assert att_data["checked_in_at"] is not None
