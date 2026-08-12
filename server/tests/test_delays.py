def test_read_active_delays_empty_initial(client):
    response = client.get("/api/v1/delays")
    assert response.status_code == 200
    delays = response.json()
    assert isinstance(delays, list)


def test_delay_alert_created_on_high_delay_telemetry(client):
    trains_res = client.get("/api/v1/trains")
    train = trains_res.json()[0]

    payload = {
        "train_id": train["id"],
        "latitude": 37.7760,
        "longitude": -122.4170,
        "speed": 15.0,
        "heading": 90.0,
        "delay_minutes": 10,
    }

    res = client.post("/api/v1/telemetry/location", json=payload)
    assert res.status_code == 200

    delays_res = client.get("/api/v1/delays")
    assert delays_res.status_code == 200
    delays = delays_res.json()
    matching = [d for d in delays if d["train_id"] == train["id"]]
    assert len(matching) >= 1
    assert matching[0]["delay_minutes"] == 10
