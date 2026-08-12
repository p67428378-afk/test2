def test_post_telemetry_location_success(client):
    trains_res = client.get("/api/v1/trains")
    train = trains_res.json()[0]

    payload = {
        "train_id": train["id"],
        "latitude": 37.7755,
        "longitude": -122.4180,
        "speed": 55.0,
        "heading": 120.0,
        "delay_minutes": 2,
    }

    response = client.post("/api/v1/telemetry/location", json=payload)
    assert response.status_code == 200
    updated_train = response.json()
    assert updated_train["latitude"] == 37.7755
    assert updated_train["longitude"] == -122.4180
    assert updated_train["speed"] == 55.0
    assert updated_train["heading"] == 120.0
    assert updated_train["status"] == "active"


def test_post_telemetry_location_creates_delay_alert(client):
    trains_res = client.get("/api/v1/trains")
    train = trains_res.json()[0]

    payload = {
        "train_id": train["id"],
        "latitude": 37.7760,
        "longitude": -122.4170,
        "speed": 20.0,
        "heading": 90.0,
        "delay_minutes": 10,
    }

    response = client.post("/api/v1/telemetry/location", json=payload)
    assert response.status_code == 200

    delays_res = client.get("/api/v1/delays")
    assert delays_res.status_code == 200
    delays = delays_res.json()
    matching_delays = [d for d in delays if d["train_id"] == train["id"]]
    assert len(matching_delays) >= 1
    assert matching_delays[0]["delay_minutes"] == 10


def test_post_telemetry_location_invalid_train(client):
    payload = {
        "train_id": "nonexistent-train-id",
        "latitude": 37.7755,
        "longitude": -122.4180,
        "speed": 50.0,
        "heading": 0.0,
    }
    response = client.post("/api/v1/telemetry/location", json=payload)
    assert response.status_code == 404
