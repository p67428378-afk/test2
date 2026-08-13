from datetime import datetime
from fastapi.testclient import TestClient


def test_crowd_telemetry_ingestion_and_occupancy_alerts(client: TestClient):
    # 1. Create a Stage with max_capacity = 10,000
    stage_resp = client.post(
        "/api/v1/stages",
        json={
            "name": "Stage North",
            "location_zone": "Zone North",
            "max_capacity": 10000,
        },
    )
    assert stage_resp.status_code == 201

    # 2. Ingest telemetry setting occupancy to 8,800 (88% -> YELLOW_WARNING)
    ingest_resp = client.post(
        "/api/v1/analytics/crowd/telemetry",
        json={
            "zone_id": "Zone North",
            "sensor_id": "Sensor-N1",
            "current_occupancy": 8800,
            "ingress_count": 200,
            "egress_count": 0,
        },
    )
    assert ingest_resp.status_code == 201

    # 3. Get Crowd Analytics
    analytics_resp = client.get("/api/v1/analytics/crowd")
    assert analytics_resp.status_code == 200
    statuses = analytics_resp.json()

    zone_status = next(s for s in statuses if s["zone_id"] == "Zone North")
    assert zone_status["current_occupancy"] == 8800
    assert zone_status["occupancy_percentage"] == 88.0
    assert zone_status["density_status"] == "YELLOW_WARNING"

    # 4. Ingest higher telemetry to reach 9,600 (96% -> RED_ALERT)
    client.post(
        "/api/v1/analytics/crowd/telemetry",
        json={
            "zone_id": "Zone North",
            "sensor_id": "Sensor-N1",
            "current_occupancy": 9600,
        },
    )

    analytics_resp2 = client.get("/api/v1/analytics/crowd")
    zone_status2 = next(
        s for s in analytics_resp2.json() if s["zone_id"] == "Zone North"
    )
    assert zone_status2["density_status"] == "RED_ALERT"


def test_rapid_influx_rate_of_change_alert(client: TestClient):
    stage_resp = client.post(
        "/api/v1/stages",
        json={
            "name": "Main Entrance Zone",
            "location_zone": "Zone Entrance",
            "max_capacity": 20000,
        },
    )

    # Ingest 1,200 ingress count in last 2 minutes
    client.post(
        "/api/v1/analytics/crowd/telemetry",
        json={
            "zone_id": "Zone Entrance",
            "sensor_id": "GateSensor-1",
            "ingress_count": 1200,
            "current_occupancy": 3000,
            "timestamp": datetime.utcnow().isoformat(),
        },
    )

    analytics_resp = client.get("/api/v1/analytics/crowd")
    zone_status = next(
        s for s in analytics_resp.json() if s["zone_id"] == "Zone Entrance"
    )

    # Influx >= 1,000 triggers rate_of_change_alert even if overall capacity is low (3,000/20,000 = 15%)
    assert zone_status["rate_of_change_2min"] >= 1000
    assert zone_status["rate_of_change_alert"] is True
    assert zone_status["density_status"] == "NORMAL"
