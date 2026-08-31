from datetime import datetime, timedelta, timezone


def test_create_booking_success(client):
    # AC2: Visitors can browse available tours, view capacity, and book tickets with instant confirmation
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Antiquities", "duration_minutes": 60},
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

    booking_payload = {
        "schedule_id": schedule_id,
        "visitor_name": "Jean Dupont",
        "visitor_email": "jean.dupont@example.com",
        "ticket_quantity": 4,
    }
    booking_res = client.post("/api/v1/bookings", json=booking_payload)
    assert booking_res.status_code == 201
    booking_data = booking_res.json()
    assert booking_data["visitor_name"] == "Jean Dupont"
    assert booking_data["ticket_quantity"] == 4
    assert booking_data["booking_status"] == "Confirmed"
    assert booking_data["tour_title"] == "Antiquities"
    assert "id" in booking_data

    # Check that schedule remaining capacity is now 6
    sched_check = client.get(f"/api/v1/schedules/{schedule_id}")
    assert sched_check.status_code == 200
    assert sched_check.json()["booked_tickets"] == 4
    assert sched_check.json()["remaining_capacity"] == 6


def test_booking_capacity_exhaustion(client):
    # AC2: Enforce capacity limit and prevent overbooking
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Small Tour", "duration_minutes": 45},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=4)).isoformat(),
            "end_time": (now + timedelta(hours=5)).isoformat(),
            "max_capacity": 5,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    # First booking: 4 tickets
    b1 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor 1",
            "visitor_email": "v1@example.com",
            "ticket_quantity": 4,
        },
    )
    assert b1.status_code == 201

    # Second booking: 2 tickets (only 1 remaining) -> should fail with 400
    b2 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor 2",
            "visitor_email": "v2@example.com",
            "ticket_quantity": 2,
        },
    )
    assert b2.status_code == 400
    assert "Insufficient ticket capacity available" in b2.json()["detail"]

    # Third booking: exactly 1 ticket -> should succeed
    b3 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor 3",
            "visitor_email": "v3@example.com",
            "ticket_quantity": 1,
        },
    )
    assert b3.status_code == 201

    # Now fully booked (5/5)
    sched_check = client.get(f"/api/v1/schedules/{schedule_id}")
    assert sched_check.json()["remaining_capacity"] == 0


def test_booking_non_published_schedule(client):
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Draft Tour", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=2)).isoformat(),
            "end_time": (now + timedelta(hours=3)).isoformat(),
            "max_capacity": 20,
            "status": "Draft",
        },
    )
    schedule_id = sched_res.json()["id"]

    res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Test Visitor",
            "visitor_email": "test@example.com",
            "ticket_quantity": 2,
        },
    )
    assert res.status_code == 400
    assert "Cannot book schedule in 'Draft' status" in res.json()["detail"]


def test_get_booking_by_id(client):
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Sculpture Tour", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=3)).isoformat(),
            "end_time": (now + timedelta(hours=4)).isoformat(),
            "max_capacity": 15,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    b_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Pierre",
            "visitor_email": "pierre@example.com",
            "ticket_quantity": 2,
        },
    )
    booking_id = b_res.json()["id"]

    get_res = client.get(f"/api/v1/bookings/{booking_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == booking_id
    assert get_res.json()["visitor_name"] == "Pierre"
