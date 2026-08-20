def test_telemetry_ingest_normal(client):
    # Get a hive id
    hives_resp = client.get("/api/v1/hives")
    assert hives_resp.status_code == 200
    hives = hives_resp.json()
    assert len(hives) > 0
    hive_id = hives[0]["id"]

    # Ingest normal telemetry (34.5 C, 60% humidity)
    payload = {
        "hive_id": hive_id,
        "temperature_celsius": 34.5,
        "humidity_percent": 60.0,
        "weight_kg": 45.2,
    }
    resp = client.post("/api/v1/telemetry", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "ingested"
    assert data["alert_triggered"] is False


def test_telemetry_ingest_anomaly_alert(client):
    hives_resp = client.get("/api/v1/hives")
    hive_id = hives_resp.json()[0]["id"]

    # Ingest anomalous temperature (30.0 C - too low)
    payload = {
        "hive_id": hive_id,
        "temperature_celsius": 30.0,
        "humidity_percent": 80.0,
        "weight_kg": 40.0,
    }
    resp = client.post("/api/v1/telemetry", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "ingested"
    assert data["alert_triggered"] is True
    assert "Low temperature" in data["alert_message"]
    assert "High humidity" in data["alert_message"]


def test_list_telemetry_logs(client):
    hives_resp = client.get("/api/v1/hives")
    hive_id = hives_resp.json()[0]["id"]

    resp = client.get(f"/api/v1/telemetry?hive_id={hive_id}")
    assert resp.status_code == 200
    logs = resp.json()
    assert isinstance(logs, list)
    assert len(logs) > 0
