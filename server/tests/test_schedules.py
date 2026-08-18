def get_tokens(client):
    admin_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    admin_token = admin_res.json()["access_token"]

    guide_res = client.post(
        "/api/v1/auth/login",
        json={"email": "guide@example.com", "password": "guidepassword"},
    )
    guide_user = guide_res.json()["user"]

    return admin_token, guide_user


def test_create_schedule_and_guide_overlap_validation(client):
    admin_token, guide_user = get_tokens(client)

    # Get sample tour
    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    start_time = "2026-10-12T10:00:00"

    # Create Schedule 1
    res1 = client.post(
        "/api/v1/schedules",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "tour_id": tour_id,
            "guide_id": guide_user["id"],
            "start_time": start_time,
            "max_capacity": 20,
        },
    )
    assert res1.status_code == 201
    sched1 = res1.json()
    assert sched1["max_capacity"] == 20
    assert sched1["remaining_capacity"] == 20

    # Attempt to create overlapping Schedule 2 for same guide at 10:30 AM (tour duration = 60 mins)
    overlap_time = "2026-10-12T10:30:00"
    res2 = client.post(
        "/api/v1/schedules",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "tour_id": tour_id,
            "guide_id": guide_user["id"],
            "start_time": overlap_time,
            "max_capacity": 15,
        },
    )
    assert res2.status_code == 400
    assert "Guide is already assigned to an overlapping tour." in res2.json()["detail"]


def test_non_overlapping_schedule(client):
    admin_token, guide_user = get_tokens(client)

    tours_res = client.get("/api/v1/tours")
    tour_id = tours_res.json()[0]["id"]

    # Non-overlapping time at 12:00 PM (first was 10:00 AM - 11:00 AM)
    non_overlap_time = "2026-10-12T12:00:00"
    res = client.post(
        "/api/v1/schedules",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "tour_id": tour_id,
            "guide_id": guide_user["id"],
            "start_time": non_overlap_time,
            "max_capacity": 15,
        },
    )
    assert res.status_code == 201
