"""Unit and integration tests for Tour Schedule management and Guide assignment."""

from datetime import datetime, timedelta, timezone


def test_list_schedules(client):
    """Test listing tour schedules with calculated capacity fields."""
    response = client.get("/api/v1/schedules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    sample = data[0]
    assert "start_time" in sample
    assert "end_time" in sample
    assert "max_capacity" in sample
    assert "booked_tickets" in sample
    assert "remaining_capacity" in sample
    assert "tour_title" in sample


def test_create_schedule(client):
    """Test creating a new tour schedule slot."""
    # First get or create tour and guide
    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    guides_res = client.get("/api/v1/guides")
    guide_id = guides_res.json()[0]["id"]

    start = datetime.now(timezone.utc) + timedelta(days=10, hours=10)
    end = start + timedelta(hours=1, minutes=30)

    payload = {
        "tour_id": tour_id,
        "guide_id": guide_id,
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
        "max_capacity": 35,
        "status": "Published",
    }
    response = client.post("/api/v1/schedules", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["tour_id"] == tour_id
    assert data["guide_id"] == guide_id
    assert data["max_capacity"] == 35
    assert data["remaining_capacity"] == 35
    assert data["booked_tickets"] == 0


def test_create_schedule_invalid_duration(client):
    """Test schedule creation rejects end_time earlier than start_time."""
    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    start = datetime.now(timezone.utc) + timedelta(days=5)
    end = start - timedelta(hours=1)

    payload = {
        "tour_id": tour_id,
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
        "max_capacity": 20,
        "status": "Draft",
    }
    response = client.post("/api/v1/schedules", json=payload)
    assert response.status_code == 400
    assert "after start_time" in response.json()["detail"]


def test_guide_assignment_and_overlap_conflict(client):
    """Test guide assignment and automatic schedule overlap conflict detection."""
    # Create a tour
    tour_res = client.post(
        "/api/v1/tours",
        json={"title": "Special Architecture Tour", "duration_minutes": 60},
    )
    tour_id = tour_res.json()["id"]

    # Create a new guide
    guide_res = client.post(
        "/api/v1/guides",
        json={
            "name": "Leonardo Da Vinci",
            "email": "leonardo.vinci@museum.org",
            "specialization": "Architecture & Engineering",
        },
    )
    guide_id = guide_res.json()["id"]

    # Create Schedule Slot 1: Day 20, 10:00 to 11:30
    start1 = datetime.now(timezone.utc).replace(microsecond=0) + timedelta(days=20, hours=10)
    end1 = start1 + timedelta(hours=1, minutes=30)
    sched1_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start1.isoformat(),
            "end_time": end1.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    assert sched1_res.status_code == 201
    sched1_id = sched1_res.json()["id"]

    # Assign guide to Slot 1 -> should succeed
    assign1 = client.post(f"/api/v1/schedules/{sched1_id}/assign-guide", json={"guide_id": guide_id})
    assert assign1.status_code == 200
    assert assign1.json()["guide_id"] == guide_id

    # Create Schedule Slot 2: Day 20, 10:30 to 12:00 (Overlaps with Slot 1!)
    start2 = start1 + timedelta(minutes=30)
    end2 = start2 + timedelta(hours=1, minutes=30)
    sched2_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start2.isoformat(),
            "end_time": end2.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    assert sched2_res.status_code == 201
    sched2_id = sched2_res.json()["id"]

    # Attempt to assign the same guide to Slot 2 -> must be REJECTED with 400
    assign2 = client.post(f"/api/v1/schedules/{sched2_id}/assign-guide", json={"guide_id": guide_id})
    assert assign2.status_code == 400
    assert "overlapping" in assign2.json()["detail"].lower()

    # Create Schedule Slot 3: Day 20, 12:00 to 13:30 (No overlap with Slot 1)
    start3 = end1 + timedelta(minutes=30)
    end3 = start3 + timedelta(hours=1, minutes=30)
    sched3_res = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start3.isoformat(),
            "end_time": end3.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    )
    sched3_id = sched3_res.json()["id"]

    # Assign guide to Slot 3 -> should succeed
    assign3 = client.post(f"/api/v1/schedules/{sched3_id}/assign-guide", json={"guide_id": guide_id})
    assert assign3.status_code == 200
    assert assign3.json()["guide_id"] == guide_id
