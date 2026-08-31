from datetime import datetime, timedelta


def test_create_and_get_schedules(client):
    # Fetch tours and guides
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]

    start = (datetime.utcnow() + timedelta(days=1)).isoformat()
    end = (datetime.utcnow() + timedelta(days=1, hours=2)).isoformat()

    payload = {
        "tour_id": tour_id,
        "start_time": start,
        "end_time": end,
        "max_capacity": 25,
        "status": "Published",
    }
    create_res = client.post("/api/v1/schedules", json=payload)
    assert create_res.status_code == 201
    sched = create_res.json()
    assert sched["max_capacity"] == 25
    assert sched["remaining_capacity"] == 25
    assert sched["booked_tickets"] == 0

    list_res = client.get("/api/v1/schedules")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1


def test_assign_guide_and_detect_overlap(client):
    tours = client.get("/api/v1/tours").json()
    guides = client.get("/api/v1/guides").json()
    tour_id = tours[0]["id"]
    guide_id = guides[0]["id"]

    t0 = datetime(2026, 9, 1, 10, 0, 0)
    t1 = datetime(2026, 9, 1, 12, 0, 0)

    # Schedule 1: 10:00 - 12:00
    sched1 = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": t0.isoformat(),
            "end_time": t1.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    ).json()

    # Assign guide to sched1
    assign_res = client.post(
        f"/api/v1/schedules/{sched1['id']}/assign-guide",
        json={"guide_id": guide_id},
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["guide_id"] == guide_id

    # Schedule 2: 11:00 - 13:00 (overlaps with 10:00 - 12:00)
    t_overlap_start = datetime(2026, 9, 1, 11, 0, 0)
    t_overlap_end = datetime(2026, 9, 1, 13, 0, 0)
    sched2 = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": t_overlap_start.isoformat(),
            "end_time": t_overlap_end.isoformat(),
            "max_capacity": 20,
            "status": "Published",
        },
    ).json()

    # Attempt to assign the same guide to overlapping sched2
    conflict_res = client.post(
        f"/api/v1/schedules/{sched2['id']}/assign-guide",
        json={"guide_id": guide_id},
    )
    assert conflict_res.status_code == 400
    assert "Schedule conflict" in conflict_res.json()["detail"]


def test_attendance_report(client):
    tours = client.get("/api/v1/tours").json()
    tour_id = tours[0]["id"]

    start = (datetime.utcnow() + timedelta(days=2)).isoformat()
    end = (datetime.utcnow() + timedelta(days=2, hours=1)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 30,
            "status": "Published",
        },
    ).json()
    sched_id = sched["id"]

    report_res = client.get(f"/api/v1/schedules/{sched_id}/attendance-report")
    assert report_res.status_code == 200
    report = report_res.json()
    assert report["schedule_id"] == sched_id
    assert report["max_capacity"] == 30
    assert report["total_booked_tickets"] == 0
    assert report["total_attended_tickets"] == 0
