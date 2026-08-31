from datetime import datetime, timedelta


def test_review_attendance_gate_and_duplicate_guard(client):
    tours = client.get("/api/v1/tours").json()
    guides = client.get("/api/v1/guides").json()
    tour_id = tours[0]["id"]
    guide_id = guides[0]["id"]

    start = (datetime.utcnow() + timedelta(days=5)).isoformat()
    end = (datetime.utcnow() + timedelta(days=5, hours=2)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "guide_id": guide_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 15,
            "status": "Published",
        },
    ).json()

    booking = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched["id"],
            "visitor_name": "Reviewer One",
            "visitor_email": "rev1@example.com",
            "ticket_quantity": 1,
        },
    ).json()
    booking_id = booking["id"]

    # 1. Attempt review without check-in -> Expect 400 Attendance gate error
    unattended_res = client.post(
        "/api/v1/reviews",
        json={
            "booking_id": booking_id,
            "rating": 5,
            "comment": "Should fail because not attended yet",
        },
    )
    assert unattended_res.status_code == 400
    assert "Attendance record not found" in unattended_res.json()["detail"]

    # 2. Record attendance check-in
    checkin_res = client.post(
        "/api/v1/attendance/check-in",
        json={
            "booking_id": booking_id,
            "schedule_id": sched["id"],
            "attended_count": 1,
        },
    )
    assert checkin_res.status_code == 201

    # 3. Submit valid 5-star review
    valid_review_res = client.post(
        "/api/v1/reviews",
        json={
            "booking_id": booking_id,
            "rating": 5,
            "comment": "Fantastic tour and insightful guide!",
        },
    )
    assert valid_review_res.status_code == 201
    review_data = valid_review_res.json()
    assert review_data["booking_id"] == booking_id
    assert review_data["tour_id"] == tour_id
    assert review_data["guide_id"] == guide_id
    assert review_data["rating"] == 5
    assert review_data["comment"] == "Fantastic tour and insightful guide!"

    # 4. Duplicate review attempt -> Expect 400
    dup_res = client.post(
        "/api/v1/reviews",
        json={
            "booking_id": booking_id,
            "rating": 4,
            "comment": "Second review attempt",
        },
    )
    assert dup_res.status_code == 400
    assert "Feedback already submitted" in dup_res.json()["detail"]


def test_rating_bounds_validation(client):
    # Rating 0 or 6 should be rejected by validation (422)
    res_high = client.post(
        "/api/v1/reviews",
        json={
            "booking_id": "00000000-0000-0000-0000-000000000000",
            "rating": 6,
        },
    )
    assert res_high.status_code in (400, 422)

    res_low = client.post(
        "/api/v1/reviews",
        json={
            "booking_id": "00000000-0000-0000-0000-000000000000",
            "rating": 0,
        },
    )
    assert res_low.status_code in (400, 422)


def test_admin_metrics_and_feedback_summary(client):
    tours = client.get("/api/v1/tours").json()
    guides = client.get("/api/v1/guides").json()
    tour_id = tours[0]["id"]
    guide_id = guides[0]["id"]

    start = (datetime.utcnow() + timedelta(days=6)).isoformat()
    end = (datetime.utcnow() + timedelta(days=6, hours=1)).isoformat()

    sched = client.post(
        "/api/v1/schedules",
        json={
            "tour_id": tour_id,
            "guide_id": guide_id,
            "start_time": start,
            "end_time": end,
            "max_capacity": 10,
            "status": "Published",
        },
    ).json()

    # Create 2 bookings with check-in and reviews
    b1 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched["id"],
            "visitor_name": "Visitor A",
            "visitor_email": "va@example.com",
            "ticket_quantity": 1,
        },
    ).json()
    client.post(
        "/api/v1/attendance/check-in",
        json={"booking_id": b1["id"], "attended_count": 1},
    )
    client.post(
        "/api/v1/reviews",
        json={"booking_id": b1["id"], "rating": 5, "comment": "Loved it!"},
    )

    b2 = client.post(
        "/api/v1/bookings",
        json={
            "schedule_id": sched["id"],
            "visitor_name": "Visitor B",
            "visitor_email": "vb@example.com",
            "ticket_quantity": 1,
        },
    ).json()
    client.post(
        "/api/v1/attendance/check-in",
        json={"booking_id": b2["id"], "attended_count": 1},
    )
    client.post(
        "/api/v1/reviews",
        json={"booking_id": b2["id"], "rating": 3, "comment": "Average pacing."},
    )

    # 1. Admin Guide Metrics Endpoint
    metrics_res = client.get(f"/api/v1/admin/guides/{guide_id}/metrics")
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert metrics["guide_id"] == guide_id
    assert metrics["total_reviews"] == 2
    assert metrics["average_rating"] == 4.0  # (5 + 3) / 2
    assert metrics["rating_breakdown"]["5_star"] == 1
    assert metrics["rating_breakdown"]["3_star"] == 1
    assert len(metrics["recent_comments"]) == 2

    # 2. Admin Feedback Summary Endpoint
    summary_res = client.get("/api/v1/admin/feedback/summary")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_reviews_collected"] >= 2
    assert summary["system_average_rating"] > 0
    assert len(summary["tours_summary"]) >= 1
    tour_item = next(
        (t for t in summary["tours_summary"] if t["tour_id"] == tour_id), None
    )
    assert tour_item is not None
    assert tour_item["total_reviews"] == 2
    assert tour_item["average_rating"] == 4.0
