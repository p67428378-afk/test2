from datetime import datetime, timedelta, timezone


def test_create_schedule_success(client):
    # AC1: Administrators can create and publish tour schedules with specific start times and max capacity
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Louvre Highlights", "duration_minutes": 90},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    start_time = (now + timedelta(days=1)).isoformat()
    end_time = (now + timedelta(days=1, hours=1, minutes=30)).isoformat()

    payload = {
        "tour_id": tour_id,
        "start_time": start_time,
        "end_time": end_time,
        "max_capacity": 30,
        "status": "Published",
    }

    res = client.post("/api/v1/schedules", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["tour_id"] == tour_id
    assert data["tour_title"] == "Louvre Highlights"
    assert data["max_capacity"] == 30
    assert data["remaining_capacity"] == 30
    assert data["status"] == "Published"


def test_create_schedule_invalid_times(client):
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Louvre Highlights", "duration_minutes": 90},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc)
    start_time = (now + timedelta(hours=2)).isoformat()
    end_time = (now + timedelta(hours=1)).isoformat()  # before start

    payload = {
        "tour_id": tour_id,
        "start_time": start_time,
        "end_time": end_time,
        "max_capacity": 20,
        "status": "Published",
    }
    res = client.post("/api/v1/schedules", json=payload)
    assert res.status_code == 400
    assert "start_time must be strictly before end_time" in res.json()["detail"]


def test_guide_assignment_and_conflict_check(client):
    # AC3: Administrators can assign guides and prevent double-booking across overlapping tour times
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Tour A", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    guide_res = client.post(
        "/api/v1/guides",
        json={"name": "Alice Guide", "email": "alice.guide@museum.org"},
    )
    guide_id = guide_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)

    # Schedule 1: 10:00 to 12:00
    s1_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=10)).isoformat(),
            "end_time": (now + timedelta(hours=12)).isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    s1_id = s1_res.json()["id"]

    # Assign Alice to Schedule 1
    assign1_res = client.post(
        f"/api/v1/schedules/{s1_id}/assign-guide",
        json={"guide_id": guide_id},
    )
    assert assign1_res.status_code == 200
    assert assign1_res.json()["guide_id"] == guide_id
    assert assign1_res.json()["guide_name"] == "Alice Guide"

    # Schedule 2: 11:00 to 13:00 (Overlaps with Schedule 1)
    s2_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=11)).isoformat(),
            "end_time": (now + timedelta(hours=13)).isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    s2_id = s2_res.json()["id"]

    # Attempt to assign Alice to overlapping Schedule 2 -> should fail with 400
    assign2_res = client.post(
        f"/api/v1/schedules/{s2_id}/assign-guide",
        json={"guide_id": guide_id},
    )
    assert assign2_res.status_code == 400
    assert (
        "already assigned to an overlapping tour schedule"
        in assign2_res.json()["detail"]
    )

    # Schedule 3: 13:00 to 14:00 (Non-overlapping)
    s3_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=13)).isoformat(),
            "end_time": (now + timedelta(hours=14)).isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    s3_id = s3_res.json()["id"]

    # Assign Alice to non-overlapping Schedule 3 -> should succeed
    assign3_res = client.post(
        f"/api/v1/schedules/{s3_id}/assign-guide",
        json={"guide_id": guide_id},
    )
    assert assign3_res.status_code == 200
    assert assign3_res.json()["guide_id"] == guide_id


def test_update_schedule_and_capacity_check(client):
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Tour B", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    s_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": (now + timedelta(hours=1)).isoformat(),
            "end_time": (now + timedelta(hours=2)).isoformat(),
            "max_capacity": 15,
            "status": "Published",
        },
    )
    s_id = s_res.json()["id"]

    # Book 10 tickets
    client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": s_id,
            "visitor_name": "Bob Visitor",
            "visitor_email": "bob@example.com",
            "ticket_quantity": 10,
        },
    )

    # Attempt to reduce capacity to 5 -> should fail because 10 are booked
    update_res = client.put(
        f"/api/v1/schedules/{s_id}",
        json={"max_capacity": 5},
    )
    assert update_res.status_code == 400
    assert "Cannot reduce capacity" in update_res.json()["detail"]

    # Increase capacity to 25 -> should succeed
    update_res2 = client.put(
        f"/api/v1/schedules/{s_id}",
        json={"max_capacity": 25},
    )
    assert update_res2.status_code == 200
    assert update_res2.json()["max_capacity"] == 25
    assert update_res2.json()["remaining_capacity"] == 15
