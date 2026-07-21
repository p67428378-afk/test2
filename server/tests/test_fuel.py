from datetime import datetime


def test_fuel_summary_empty(client):
    response = client.get("/api/v1/fuel/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["average_efficiency"] == 0.0
    assert data["total_distance_traveled"] == 0.0
    assert data["total_fuel_consumed"] == 0.0
    assert len(data["logs"]) == 0


def test_create_fuel_log_and_summary(client):
    # Create a fuel log
    log_payload = {
        "vessel_id": "RV Atlantis",
        "fuel_consumed": 100.0,
        "distance_traveled": 50.0,
        "timestamp": datetime.now().isoformat(),
    }
    log_resp = client.post("/api/v1/fuel/logs", json=log_payload)
    assert log_resp.status_code == 201
    assert log_resp.json()["vessel_id"] == "RV Atlantis"

    # Create another fuel log
    log_payload2 = {
        "vessel_id": "RV Atlantis",
        "fuel_consumed": 200.0,
        "distance_traveled": 150.0,
        "timestamp": datetime.now().isoformat(),
    }
    client.post("/api/v1/fuel/logs", json=log_payload2)

    # Get summary
    summary_resp = client.get("/api/v1/fuel/summary")
    assert summary_resp.status_code == 200
    data = summary_resp.json()
    assert data["total_fuel_consumed"] == 300.0
    assert data["total_distance_traveled"] == 200.0
    # Efficiency = 200 / 300 = 0.67
    assert data["average_efficiency"] == 0.67
    assert len(data["logs"]) == 2
