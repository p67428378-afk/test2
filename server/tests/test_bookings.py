from datetime import datetime, timedelta


def test_booking_creation_and_capacity_decrement(client):
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]

    start = (datetime.utcnow() + timedelta(days=3)).isoformat()
    end = (datetime.utcnow() + timedelta(days=3, hours=1)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 5,
            "status": "Published",
        },
    ).json()
    sched_id = sched["id"]

    # Book 3 tickets
    booking1 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched_id,
            "visitor_name": "John Doe",
            "visitor_email": "john@example.com",
            "ticket_quantity": 3,
        },
    )
    assert booking1.status_code == 201
    assert booking1.json()["ticket_quantity"] == 3
    assert booking1.json()["booking_status"] == "Confirmed"

    # Verify schedule capacity updated
    sched_updated = client.get(f"/api/v1/schedules/{sched_id}").json()
    assert sched_updated["booked_tickets"] == 3
    assert sched_updated["remaining_capacity"] == 2

    # Attempt to book 3 more tickets when only 2 remain -> should fail with 400
    booking2 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched_id,
            "visitor_name": "Jane Smith",
            "visitor_email": "jane@example.com",
            "ticket_quantity": 3,
        },
    )
    assert booking2.status_code == 400
    assert "Insufficient capacity" in booking2.json()["detail"]

    # Book exactly 2 tickets -> should succeed
    booking3 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched_id,
            "visitor_name": "Jane Smith",
            "visitor_email": "jane@example.com",
            "ticket_quantity": 2,
        },
    )
    assert booking3.status_code == 201

    # Now fully booked
    sched_full = client.get(f"/api/v1/schedules/{sched_id}").json()
    assert sched_full["booked_tickets"] == 5
    assert sched_full["remaining_capacity"] == 0


def test_cancel_booking(client):
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]
    start = (datetime.utcnow() + timedelta(days=4)).isoformat()
    end = (datetime.utcnow() + timedelta(days=4, hours=1)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 10,
            "status": "Published",
        },
    ).json()
    sched_id = sched["id"]

    booking = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched_id,
            "visitor_name": "Mark Wilson",
            "visitor_email": "mark@example.com",
            "ticket_quantity": 4,
        },
    ).json()

    # Cancel booking
    cancel_res = client.post(f"/api/v1/bookings/{booking['id']}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["booking_status"] == "Cancelled"

    # Capacity should be restored
    sched_check = client.get(f"/api/v1/schedules/{sched_id}").json()
    assert sched_check["booked_tickets"] == 0
    assert sched_check["remaining_capacity"] == 10
