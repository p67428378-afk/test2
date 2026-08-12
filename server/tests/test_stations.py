def test_read_stations(client):
    response = client.get("/api/v1/stations")
    assert response.status_code == 200
    stations = response.json()
    assert isinstance(stations, list)
    assert len(stations) >= 3


def test_search_stations(client):
    response = client.get("/api/v1/stations?search=Central")
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) == 1
    assert stations[0]["code"] == "CENTRAL"


def test_read_station_schedules(client):
    stations_res = client.get("/api/v1/stations?search=CENTRAL")
    station_id = stations_res.json()[0]["id"]

    response = client.get(f"/api/v1/stations/{station_id}/schedules")
    assert response.status_code == 200
    schedules = response.json()
    assert isinstance(schedules, list)
    assert len(schedules) >= 1
    sched = schedules[0]
    assert "scheduled_arrival" in sched
    assert "predicted_eta" in sched
    assert "delay_minutes" in sched


def test_read_station_schedules_not_found(client):
    response = client.get("/api/v1/stations/nonexistent-id/schedules")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
