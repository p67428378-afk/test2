from datetime import datetime, timedelta
from fastapi.testclient import TestClient


def test_list_stages(client: TestClient):
    response = client.get("/api/v1/stages")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_create_and_allocate_stage_performance(client: TestClient):
    # 1. Create Stage
    stage_resp = client.post(
        "/api/v1/stages",
        json={
            "name": "Rock Arena",
            "location_zone": "Zone West",
            "max_capacity": 15000,
        },
    )
    assert stage_resp.status_code == 201
    stage = stage_resp.json()
    stage_id = stage["id"]

    # 2. Create Artist
    artist_resp = client.post(
        "/api/v1/artists",
        json={
            "name": "Band Alpha",
            "genre": "Indie Rock",
            "tech_spec_summary": "4 mics",
        },
    )
    assert artist_resp.status_code == 201
    artist_id = artist_resp.json()["id"]

    start_time = (datetime.utcnow() + timedelta(days=1)).replace(
        hour=18, minute=0, second=0, microsecond=0
    )
    end_time = start_time + timedelta(hours=1, minutes=30)

    # 3. Allocate Performance Set 1 (18:00 to 19:30)
    perf1_resp = client.post(
        f"/api/v1/stages/{stage_id}/performances",
        json={
            "artist_id": artist_id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "buffer_minutes": 30,
        },
    )
    assert perf1_resp.status_code == 201
    perf1 = perf1_resp.json()
    assert perf1["status"] == "SCHEDULED"

    # 4. Attempt Conflict: Schedule another artist at 19:15 on same stage (violates 30m buffer ending at 20:00)
    artist2_resp = client.post(
        "/api/v1/artists", json={"name": "Band Beta", "genre": "Metal"}
    )
    artist2_id = artist2_resp.json()["id"]

    conflict_start = start_time + timedelta(hours=1, minutes=15)  # 19:15
    conflict_end = conflict_start + timedelta(hours=1)  # 20:15

    conflict_resp = client.post(
        f"/api/v1/stages/{stage_id}/performances",
        json={
            "artist_id": artist2_id,
            "start_time": conflict_start.isoformat(),
            "end_time": conflict_end.isoformat(),
            "buffer_minutes": 30,
        },
    )
    assert conflict_resp.status_code == 409
    assert (
        "conflict" in conflict_resp.json()["detail"].lower()
        or "buffer" in conflict_resp.json()["detail"].lower()
    )


def test_delay_performance_propagation(client: TestClient):
    stage_resp = client.post(
        "/api/v1/stages",
        json={
            "name": "Delay Test Stage",
            "location_zone": "Zone Central",
            "max_capacity": 5000,
        },
    )
    stage_id = stage_resp.json()["id"]

    artist1_id = client.post(
        "/api/v1/artists", json={"name": "Artist D1", "genre": "Pop"}
    ).json()["id"]
    artist2_id = client.post(
        "/api/v1/artists", json={"name": "Artist D2", "genre": "Jazz"}
    ).json()["id"]

    t0 = (datetime.utcnow() + timedelta(days=2)).replace(
        hour=14, minute=0, second=0, microsecond=0
    )

    # Set 1: 14:00 - 15:00
    p1 = client.post(
        f"/api/v1/stages/{stage_id}/performances",
        json={
            "artist_id": artist1_id,
            "start_time": t0.isoformat(),
            "end_time": (t0 + timedelta(hours=1)).isoformat(),
            "buffer_minutes": 30,
        },
    ).json()

    # Set 2: 15:30 - 16:30
    p2 = client.post(
        f"/api/v1/stages/{stage_id}/performances",
        json={
            "artist_id": artist2_id,
            "start_time": (t0 + timedelta(hours=1, minutes=30)).isoformat(),
            "end_time": (t0 + timedelta(hours=2, minutes=30)).isoformat(),
            "buffer_minutes": 30,
        },
    ).json()

    # Delay Set 1 by 30 minutes
    delay_resp = client.post(
        f"/api/v1/stages/{stage_id}/performances/{p1['id']}/delay",
        json={"delay_minutes": 30},
    )
    assert delay_resp.status_code == 200
    updated_list = delay_resp.json()
    assert len(updated_list) == 2
    # Verify Set 1 delayed to 14:30 - 15:30
    assert updated_list[0]["status"] == "DELAYED"
    # Verify Set 2 pushed back to 16:00 - 17:00
    assert updated_list[1]["status"] == "DELAYED"
