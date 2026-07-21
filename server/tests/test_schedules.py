from datetime import datetime, timedelta


def test_create_schedule(client):
    start_date = datetime.now() + timedelta(days=1)
    end_date = datetime.now() + timedelta(days=10)

    payload = {
        "vessel_name": "RV Atlantis",
        "route": "Woods Hole to Bermuda",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "destination_port": "BDA-HAM",
        "status": "Planned",
        "notes": "Scientific survey",
    }
    response = client.post("/api/v1/schedules", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["vessel_name"] == "RV Atlantis"
    assert data["destination_port"] == "BDA-HAM"
    assert "id" in data


def test_create_schedule_invalid_dates(client):
    start_date = datetime.now() + timedelta(days=10)
    end_date = datetime.now() + timedelta(days=1)

    payload = {
        "vessel_name": "RV Atlantis",
        "route": "Woods Hole to Bermuda",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "destination_port": "BDA-HAM",
        "status": "Planned",
    }
    response = client.post("/api/v1/schedules", json=payload)
    assert response.status_code in [400, 422]


def test_get_schedules(client):
    response = client.get("/api/v1/schedules")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_schedule_not_found(client):
    response = client.get("/api/v1/schedules/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_update_schedule(client):
    # First create a schedule
    start_date = datetime.now() + timedelta(days=1)
    end_date = datetime.now() + timedelta(days=10)
    payload = {
        "vessel_name": "RV Atlantis",
        "route": "Woods Hole to Bermuda",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "destination_port": "BDA-HAM",
        "status": "Planned",
    }
    create_resp = client.post("/api/v1/schedules", json=payload)
    schedule_id = create_resp.json()["id"]

    # Update status to Underway
    update_payload = {"status": "Underway"}
    update_resp = client.put(f"/api/v1/schedules/{schedule_id}", json=update_payload)
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "Underway"
