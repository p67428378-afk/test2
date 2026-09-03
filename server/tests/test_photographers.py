"""Unit and integration tests for Photographer & Availability endpoints."""


def test_list_photographers(client):
    response = client.get("/api/v1/photographers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    elena = next((p for p in data if "Elena" in (p["full_name"] or "")), None)
    assert elena is not None
    assert elena["is_active"] is True


def test_get_photographer_by_id(client):
    photogs = client.get("/api/v1/photographers").json()
    photog_id = photogs[0]["id"]

    response = client.get(f"/api/v1/photographers/{photog_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == photog_id
    assert "specialization" in data


def test_get_photographer_slots(client):
    photogs = client.get("/api/v1/photographers").json()
    photog_id = photogs[0]["id"]

    response = client.get(f"/api/v1/photographers/{photog_id}/slots?date=2026-06-20")
    assert response.status_code == 200
    slots = response.json()
    assert len(slots) >= 4
    assert any(s["start_time"] == "14:00" for s in slots)


def test_set_working_hours(client):
    photogs = client.get("/api/v1/photographers").json()
    photog_id = photogs[0]["id"]

    payload = {
        "start_time": "08:00",
        "end_time": "18:00",
        "day_of_week": 1,
        "is_blocked": False,
    }
    response = client.post(
        f"/api/v1/photographers/{photog_id}/availability", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["start_time"] == "08:00"
    assert data["end_time"] == "18:00"


def test_block_date_with_conflict_warning(client):
    photogs = client.get("/api/v1/photographers").json()
    elena = next((p for p in photogs if "Elena" in (p["full_name"] or "")), photogs[0])

    # Date 2026-06-20 has the seeded session for Elena
    payload = {
        "blocked_date": "2026-06-20",
        "reason": "Studio Maintenance & Equipment Calibration",
        "is_blocked": True,
    }
    response = client.post(
        f"/api/v1/photographers/{elena['id']}/availability", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_blocked"] is True
    assert data["warning"] is not None
    assert "Conflict Alert" in data["warning"]
    assert len(data["conflicting_sessions"]) >= 1
