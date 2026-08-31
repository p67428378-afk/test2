from datetime import datetime, timedelta, timezone


def test_attendance_check_in_success(client):
    # AC4: Guides or admins can check in booked visitors and record attendance
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Mona Lisa Special", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=1)).isoformat(),
            "end_time": (now + timedelta(hours=2)).isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    booking_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Alice Smith",
            "visitor_email": "alice.smith@example.com",
            "ticket_quantity": 3,
        },
    )
    booking_id = booking_res.json()["id"]

    checkin_payload = {
        "booking_id": booking_id,
        "schedule_id": schedule_id,
        "attended_count": 3,
        "notes": "Group arrived on time at the north entrance.",
    }
    checkin_res = client.post("/api/v1/attendance/check-in", json=checkin_payload)
    assert checkin_res.status_code == 201
    data = checkin_res.json()
    assert data["booking_id"] == booking_id
    assert data["attended_count"] == 3
    assert data["visitor_name"] == "Alice Smith"
    assert "id" in data


def test_attendance_check_in_exceeds_booked_tickets(client):
    # AC4: Attended count cannot exceed booked ticket quantity
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Sculptures", "duration_minutes": 45},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=2)).isoformat(),
            "end_time": (now + timedelta(hours=3)).isoformat(),
            "max_capacity": 10,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    booking_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Bob",
            "visitor_email": "bob@example.com",
            "ticket_quantity": 2,
        },
    )
    booking_id = booking_res.json()["id"]

    checkin_res = client.post(
        "/api/v1/attendance/check-in",
        json={"booking_id": booking_id, "attended_count": 5},
    )
    assert checkin_res.status_code == 400
    assert "cannot exceed booked ticket quantity" in checkin_res.json()["detail"]


def test_attendance_report_generation(client):
    # AC4: Generate attendance reports per tour session
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Egyptian Antiquities", "duration_minutes": 90},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=3)).isoformat(),
            "end_time": (now + timedelta(hours=4, minutes=30)).isoformat(),
            "max_capacity": 25,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    # Booking 1: 4 tickets
    b1_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor 1",
            "visitor_email": "v1@example.com",
            "ticket_quantity": 4,
        },
    )
    b1_id = b1_res.json()["id"]

    # Booking 2: 6 tickets
    b2_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor 2",
            "visitor_email": "v2@example.com",
            "ticket_quantity": 6,
        },
    )
    b2_id = b2_res.json()["id"]

    # Check-in 1: all 4 attended
    client.post(
        "/api/v1/attendance/check-in",
        json={"booking_id": b1_id, "attended_count": 4},
    )
    # Check-in 2: only 4 of 6 attended (2 no-show)
    client.post(
        "/api/v1/attendance/check-in",
        json={"booking_id": b2_id, "attended_count": 4, "notes": "2 visitors no-show"},
    )

    # Fetch Attendance Report for this schedule
    report_res = client.get(f"/api/v1/schedules/{schedule_id}/attendance-report")
    assert report_res.status_code == 200
    report_data = report_res.json()

    assert report_data["schedule_id"] == schedule_id
    assert report_data["tour_title"] == "Egyptian Antiquities"
    assert report_data["max_capacity"] == 25
    assert report_data["total_booked_tickets"] == 10  # 4 + 6
    assert report_data["total_attended_tickets"] == 8  # 4 + 4
    assert report_data["attendance_rate_percentage"] == 80.0  # 8 / 10 * 100
    assert len(report_data["check_ins"]) == 2
