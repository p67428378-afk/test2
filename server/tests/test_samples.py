from datetime import datetime, timedelta


def test_create_sample(client):
    # Create schedule
    start_date = datetime.now() + timedelta(days=1)
    end_date = datetime.now() + timedelta(days=10)
    schedule_payload = {
        "vessel_name": "RV Atlantis",
        "route": "Woods Hole to Bermuda",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "destination_port": "BDA-HAM",
        "status": "Planned",
    }
    schedule_resp = client.post("/api/v1/schedules", json=schedule_payload)
    schedule_id = schedule_resp.json()["id"]

    # Create expedition
    exp_payload = {
        "name": "Deep-Sea Vent Survey",
        "schedule_id": schedule_id,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "research_goals": "Study hydrothermal vents",
    }
    exp_resp = client.post("/api/v1/expeditions", json=exp_payload)
    expedition_id = exp_resp.json()["id"]

    # Create sample
    sample_payload = {
        "expedition_id": expedition_id,
        "sample_type": "Basalt Rock",
        "collection_date": datetime.now().isoformat(),
        "storage_location": "Cold Room A",
        "notes": "Collected near vent #3",
    }
    response = client.post("/api/v1/samples", json=sample_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["sample_type"] == "Basalt Rock"
    assert data["storage_location"] == "Cold Room A"
    assert data["expedition_id"] == expedition_id


def test_create_sample_invalid_expedition(client):
    sample_payload = {
        "expedition_id": "00000000-0000-0000-0000-000000000000",
        "sample_type": "Basalt Rock",
        "collection_date": datetime.now().isoformat(),
        "storage_location": "Cold Room A",
    }
    response = client.post("/api/v1/samples", json=sample_payload)
    assert response.status_code == 404


def test_get_samples(client):
    response = client.get("/api/v1/samples")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
