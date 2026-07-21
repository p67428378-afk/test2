def test_get_weather_alerts_valid(client):
    # Sector 4-North coordinates
    response = client.get("/api/v1/weather/alerts?latitude=25.0&longitude=-75.0")
    assert response.status_code == 200
    data = response.json()
    assert "alerts" in data
    assert len(data["alerts"]) > 0
    assert data["alerts"][0]["severity"] == "amber"


def test_get_weather_alerts_invalid_lat(client):
    response = client.get("/api/v1/weather/alerts?latitude=95.0&longitude=0.0")
    assert response.status_code == 400
    assert "Latitude must be between -90 and 90" in response.json()["detail"]


def test_get_weather_alerts_invalid_lon(client):
    response = client.get("/api/v1/weather/alerts?latitude=0.0&longitude=185.0")
    assert response.status_code == 400
    assert "Longitude must be between -180 and 180" in response.json()["detail"]
