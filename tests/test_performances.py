from datetime import datetime, timedelta
import pytest


def test_list_artists_and_stages(client):
    artists_resp = client.get("/api/v1/artists")
    assert artists_resp.status_code == 200
    artists = artists_resp.json()
    assert len(artists) >= 1

    stages_resp = client.get("/api/v1/stages")
    assert stages_resp.status_code == 200
    stages = stages_resp.json()
    assert len(stages) >= 1


def test_schedule_performance_and_conflict_detection(client):
    # Login as Admin / Manager to obtain Bearer token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch seeded stage and artists
    artists = client.get("/api/v1/artists").json()
    stages = client.get("/api/v1/stages").json()

    artist_1 = artists[0]
    artist_2 = artists[1]
    stage_main = stages[0]
    stage_indie = stages[1]

    now = datetime.utcnow()
    start_time = now + timedelta(hours=2)
    end_time = start_time + timedelta(hours=2)

    # 1. Schedule Headliner Band A on Main Stage from 20:00 to 22:00
    resp1 = client.post(
        "/api/v1/performances",
        json={
            "artist_id": artist_1["id"],
            "stage_id": stage_main["id"],
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        },
        headers=headers,
    )
    assert resp1.status_code == 201
    p1 = resp1.json()
    assert p1["status"] == "SCHEDULED"

    # 2. Stage Conflict Test: Attempt to schedule Artist 2 on Main Stage during overlapping window
    overlap_start = start_time + timedelta(minutes=30)
    overlap_end = end_time + timedelta(minutes=30)

    resp_stage_conflict = client.post(
        "/api/v1/performances",
        json={
            "artist_id": artist_2["id"],
            "stage_id": stage_main["id"],
            "start_time": overlap_start.isoformat(),
            "end_time": overlap_end.isoformat(),
        },
        headers=headers,
    )
    assert resp_stage_conflict.status_code == 409
    assert "already reserved" in resp_stage_conflict.json()["detail"]

    # 3. Artist Double-Booking Test: Attempt to schedule Artist 1 on Indie Stage during overlapping window
    resp_artist_conflict = client.post(
        "/api/v1/performances",
        json={
            "artist_id": artist_1["id"],
            "stage_id": stage_indie["id"],
            "start_time": overlap_start.isoformat(),
            "end_time": overlap_end.isoformat(),
        },
        headers=headers,
    )
    assert resp_artist_conflict.status_code == 409
    assert "already booked" in resp_artist_conflict.json()["detail"]


def test_list_performances(client):
    resp = client.get("/api/v1/performances")
    assert resp.status_code == 200
    performances = resp.json()
    assert isinstance(performances, list)
