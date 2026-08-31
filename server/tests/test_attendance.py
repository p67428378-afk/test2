from datetime import datetime, timedelta


def test_attendance_check_in(client):
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]
    start = (datetime.utcnow() + timedelta(days=1)).isoformat()
    end = (datetime.utcnow() + timedelta(days=1, hours=1)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 20,
            "status": "Published",
        },
    ).json()

    booking = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched["id"],
            "visitor_name": "Sarah Connor",
            "visitor_email": "sarah@example.com",
            "ticket_quantity": 2,
        },
    ).json()

    # Record check-in
    checkin_res = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": booking["id"],
            "schedule_id": sched["id"],
            "attended_count": 2,
            "notes": "VIP priority check-in",
        },
    )
    assert checkin_res.status_code == 201
    record = checkin_res.json()
    assert record["booking_id"] == booking["id"]
    assert record["attended_count"] == 2
    assert record["notes"] == "VIP priority check-in"

    # Verify booking status updated to ATTENDED
    booking_check = client.get(f"/api/v1/bookings/{booking['id']}").json()
    assert booking_check["booking_status"] == "ATTENDED"

    # Verify attendance list
    list_res = client.get("/api/v1/attendance")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1
