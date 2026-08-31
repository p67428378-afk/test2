"""Unit and integration tests for Visitor Bookings and Capacity Enforcement."""

from datetime import datetime, timedelta, timezone


def test_create_booking_success(client):
    """Test successful visitor booking reservation."""
    schedules = client.get("/api/v1/schedules").json()
    schedule_id = schedules[0]["id"]
    initial_remaining = schedules[0]["remaining_capacity"]

    payload = {
        "schedule_id": schedule_id,
        "visitor_name": "Jean Dupont",
        "visitor_email": "jean.dupont@paris.fr",
        "ticket_quantity": 3,
    }
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["visitor_name"] == "Jean Dupont"
    assert data["ticket_quantity"] == 3
    assert data["booking_status"] == "Confirmed"
    assert "id" in data

    # Verify remaining capacity reduced by 3
    updated_schedule = client.get(f"/api/v1/schedules/{schedule_id}").json()
    assert updated_schedule["remaining_capacity"] == initial_remaining - 3
    assert updated_schedule["booked_tickets"] >= 3


def test_booking_capacity_limit_enforcement(client):
    """Test capacity enforcement prevents booking when seats are full."""
    # Create small capacity schedule
    tour_res = client.post("/api/v1/tours", json={"title": "Private Vault Tour", "duration_minutes": 30})
    tour_id = tour_res.json()["id"]

    start = datetime.now(timezone.utc) + timedelta(days=15)
    end = start + timedelta(minutes=30)
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "max_capacity": 5,
            "status": "Published",
        },
    )
    schedule_id = sched_res.json()["id"]

    # Book 4 tickets (allowed)
    res1 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor One",
            "visitor_email": "v1@test.com",
            "ticket_quantity": 4,
        },
    )
    assert res1.status_code == 201

    # Attempt to book 2 more tickets (exceeds 5 total, only 1 left) -> must fail with 400
    res2 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor Two",
            "visitor_email": "v2@test.com",
            "ticket_quantity": 2,
        },
    )
    assert res2.status_code == 400
    assert "capacity" in res2.json()["detail"].lower()

    # Book 1 ticket (exact fit) -> succeeds
    res3 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Visitor Three",
            "visitor_email": "v3@test.com",
            "ticket_quantity": 1,
        },
    )
    assert res3.status_code == 201

    # Verify 0 seats left
    sched_info = client.get(f"/api/v1/schedules/{schedule_id}").json()
    assert sched_info["remaining_capacity"] == 0
    assert sched_info["booked_tickets"] == 5


def test_get_booking_by_id(client):
    """Test retrieving booking confirmation."""
    schedules = client.get("/api/v1/schedules").json()
    schedule_id = schedules[0]["id"]

    create_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Sophie Martin",
            "visitor_email": "sophie.m@paris.fr",
            "ticket_quantity": 2,
        },
    )
    booking_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/bookings/{booking_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == booking_id
    assert get_res.json()["visitor_name"] == "Sophie Martin"


def test_cancel_booking_releases_capacity(client):
    """Test cancelling booking releases capacity back to schedule."""
    tour_res = client.post("/api/v1/tours", json={"title": "Cancel Test Tour", "duration_minutes": 30})
    tour_id = tour_res.json()["id"]

    start = datetime.now(timezone.utc) + timedelta(days=16)
    end = start + timedelta(minutes=30)
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

    # Book 6 tickets
    book_res = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": schedule_id,
            "visitor_name": "Canceller",
            "visitor_email": "cancel@test.com",
            "ticket_quantity": 6,
        },
    )
    booking_id = book_res.json()["id"]

    sched_before = client.get(f"/api/v1/schedules/{schedule_id}").json()
    assert sched_before["remaining_capacity"] == 4

    # Cancel the booking
    cancel_res = client.put(f"/api/v1/bookings/{booking_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["booking_status"] == "Cancelled"

    # Capacity should be restored back to 10
    sched_after = client.get(f"/api/v1/schedules/{schedule_id}").json()
    assert sched_after["remaining_capacity"] == 10
