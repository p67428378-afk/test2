from datetime import datetime, timezone, timedelta


def test_create_study_schedule(client):
    # AC: Study Schedule Creation: Users can build study schedules with target study dates
    sub_res = client.post("/api/v1/subjects", json={"title": "Calculus II"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Integration by Parts",
            "estimated_minutes": 60,
            "difficulty": "Medium",
        },
    )
    topic_id = topic_res.json()["id"]

    sched_time = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "topic_id": topic_id,
            "scheduled_date": sched_time,
            "duration_minutes": 90,
            "is_completed": False,
        },
    )
    assert sched_res.status_code == 201
    data = sched_res.json()
    assert data["topic_id"] == topic_id
    assert data["duration_minutes"] == 90
    assert data["is_completed"] is False
    assert "id" in data


def test_daily_study_goal_and_tracking(client):
    # AC: Study Schedule Creation: Users can build study schedules with target study dates and daily time goals
    target_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Set daily goal of 120 minutes
    goal_res = client.post(
        "/api/v1/schedules/daily-goal",
        json={"target_date": target_date, "target_minutes": 120},
    )
    assert goal_res.status_code == 201
    goal_data = goal_res.json()
    assert goal_data["target_date"] == target_date
    assert goal_data["target_minutes"] == 120
    assert goal_data["goal_met"] is False

    # Create subject and topic
    sub_res = client.post("/api/v1/subjects", json={"title": "Algorithms"})
    topic_res = client.post(
        "/api/v1/topics",
        json={"subject_id": sub_res.json()["id"], "title": "Dynamic Programming"},
    )
    topic_id = topic_res.json()["id"]

    # Log 130 minutes of study
    client.post(
        "/api/v1/study-logs",
        json={
            "topic_id": topic_id,
            "session_minutes": 130,
            "notes": "Completed DP problems",
        },
    )

    # Fetch daily goal stats
    fetch_res = client.get(f"/api/v1/schedules/daily-goal/{target_date}")
    assert fetch_res.status_code == 200
    stats = fetch_res.json()
    assert stats["completed_minutes"] >= 130
    assert stats["goal_met"] is True


def test_create_schedule_invalid_topic(client):
    # AC: Creating schedule for non-existent topic returns 404
    sched_time = datetime.now(timezone.utc).isoformat()
    res = client.post(
        "/api/v1/schedules",
        json={
            "topic_id": "non-existent-topic-id",
            "scheduled_date": sched_time,
            "duration_minutes": 60,
        },
    )
    assert res.status_code == 404


def test_list_and_filter_schedules(client):
    # AC: Users can fetch scheduled study blocks filtered by dates or completion status
    sub_res = client.post("/api/v1/subjects", json={"title": "Economics"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Microeconomics",
            "estimated_minutes": 45,
        },
    )
    topic_id = topic_res.json()["id"]

    now = datetime.now(timezone.utc)
    t1 = (now + timedelta(days=2)).isoformat()
    t2 = (now + timedelta(days=5)).isoformat()

    client.post(
        "/api/v1/schedules",
        json={
            "topic_id": topic_id,
            "scheduled_date": t1,
            "duration_minutes": 45,
            "is_completed": True,
        },
    )
    client.post(
        "/api/v1/schedules",
        json={
            "topic_id": topic_id,
            "scheduled_date": t2,
            "duration_minutes": 60,
            "is_completed": False,
        },
    )

    # Filter by completion
    res_completed = client.get("/api/v1/schedules?is_completed=true")
    assert res_completed.status_code == 200
    assert any(s["is_completed"] is True for s in res_completed.json())

    # Filter by topic_id
    res_topic = client.get(f"/api/v1/schedules?topic_id={topic_id}")
    assert res_topic.status_code == 200
    assert len(res_topic.json()) == 2


def test_update_and_delete_schedule(client):
    # AC: Users can update or delete schedule blocks
    sub_res = client.post("/api/v1/subjects", json={"title": "Statistics"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Probability Distributions",
            "estimated_minutes": 50,
        },
    )
    topic_id = topic_res.json()["id"]

    sched_time = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
    sched_res = client.post(
        "/api/v1/schedules",
        json={
            "topic_id": topic_id,
            "scheduled_date": sched_time,
            "duration_minutes": 50,
        },
    )
    sched_id = sched_res.json()["id"]

    # Mark as completed via PATCH
    update_res = client.patch(
        f"/api/v1/schedules/{sched_id}",
        json={"is_completed": True, "duration_minutes": 60},
    )
    assert update_res.status_code == 200
    assert update_res.json()["is_completed"] is True
    assert update_res.json()["duration_minutes"] == 60

    # Delete schedule
    del_res = client.delete(f"/api/v1/schedules/{sched_id}")
    assert del_res.status_code == 204
    assert client.get(f"/api/v1/schedules/{sched_id}").status_code == 404
