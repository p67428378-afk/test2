"""Unit and integration tests for Visitor Attendance Recording and Session Reports."""

from datetime import datetime, timedelta, timezone


def test_attendance_check_in_and_report(client):
    """Test recording visitor check-in and verifying attendance reports."""
    # 1. Create a schedule
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]

    start = datetime.now(timezone.utc) + timedelta(days=2)
    end = start + timedelta(hours=1)

    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    # 2. Book 4 tickets
    book1 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Family Alpha",
            "visitor_email": "alpha@test.com",
            "ticket_quantity": 4,
        },
    ).json()

    # 3. Book 2 tickets
    book2 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor Beta",
            "visitor_email": "beta@test.com",
            "ticket_quantity": 2,
        },
    ).json()

    # 4. Check in Family Alpha (3 of 4 attended)
    checkin1 = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": book1["id"],
            "schedule_id": schedule_id,
            "attended_count": 3,
            "notes": "1 child unwell, 3 entered",
        },
    )
    assert checkin1.status_code == 201
    assert checkin1.json()["attended_count"] == 3

    # 5. Check in Visitor Beta (all 2 attended)
    checkin2 = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": book2["id"],
            "schedule_id": schedule_id,
            "attended_count": 2,
            "notes": "Arrived on time",
        },
    )
    assert checkin2.status_code == 201

    # 6. Check attendance report
    report_res = client.get(f"/api/v1/schedules/{schedule_id}/attendance-report")
    assert report_res.status_code == 200
    report = report_res.json()
    assert report["schedule_id"] == schedule_id
    assert report["total_booked"] == 6  # 4 + 2
    assert report["total_attended"] == 5  # 3 + 2
    assert report["no_shows"] == 1  # 6 - 5
    assert report["attendance_rate_percentage"] == round(5 / 6 * 100.0, 2)
    assert len(report["records"]) == 2


def test_attendance_checkin_validation_errors(client):
    """Test attendance check-in input validation."""
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]

    start = datetime.now(timezone.utc) + timedelta(days=3)
    end = start + timedelta(hours=1)

    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "max_capacity": 10,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    # Book 2 tickets
    booking = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Test Group",
            "visitor_email": "group@test.com",
            "ticket_quantity": 2,
        },
    ).json()

    # Attempt to check in 3 tickets (booked only 2) -> 400
    res1 = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": booking["id"],
            "schedule_id": schedule_id,
            "attended_count": 3,
        },
    )
    assert res1.status_code == 400
    assert "exceeds booked" in res1.json()["detail"].lower()

    # Attempt check in with wrong schedule ID -> 400
    res2 = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": booking["id"],
            "schedule_id": "wrong-schedule-id",
            "attended_count": 2,
        },
    )
    assert res2.status_code == 400
    assert "does not match" in res2.json()["detail"].lower()
