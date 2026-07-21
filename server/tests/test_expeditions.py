from datetime import datetime, timedelta


def test_create_expedition(client):
    # Create schedule first
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
    response = client.post("/api/v1/expeditions", json=exp_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Deep-Sea Vent Survey"
    assert data["schedule_id"] == schedule_id


def test_create_expedition_invalid_schedule(client):
    start_date = datetime.now() + timedelta(days=1)
    end_date = datetime.now() + timedelta(days=10)
    exp_payload = {
        "name": "Deep-Sea Vent Survey",
        "schedule_id": "00000000-0000-0000-0000-000000000000",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "research_goals": "Study hydrothermal vents",
    }
    response = client.post("/api/v1/expeditions", json=exp_payload)
    assert response.status_code == 404


def test_assign_crew_to_expedition(client):
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

    # Create crew member
    crew_payload = {
        "first_name": "Helen",
        "last_name": "Vance",
        "certification": "Chief Scientist",
    }
    crew_resp = client.post("/api/v1/crew", json=crew_payload)
    crew_id = crew_resp.json()["id"]

    # Assign crew
    assign_payload = {"crew_id": crew_id, "role": "Lead Researcher"}
    assign_resp = client.post(
        f"/api/v1/expeditions/{expedition_id}/crew", json=assign_payload
    )
    assert assign_resp.status_code == 201
    assert assign_resp.json()["crew_id"] == crew_id
    assert assign_resp.json()["expedition_id"] == expedition_id

    # Get expedition crew
    get_crew_resp = client.get(f"/api/v1/expeditions/{expedition_id}/crew")
    assert get_crew_resp.status_code == 200
    assert len(get_crew_resp.json()) == 1
    assert get_crew_resp.json()[0]["first_name"] == "Helen"
    assert get_crew_resp.json()[0]["role"] == "Lead Researcher"
