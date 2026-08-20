def test_get_seasonal_analytics(client):
    response = client.get("/api/v1/analytics/seasonal?season=Summer")
    assert response.status_code == 200
    data = response.json()
    assert data["season"] == "Summer"
    assert "total_harvest_yield_kg" in data
    assert "avg_temperature_celsius" in data
    assert "avg_humidity_percent" in data
    assert "estimated_bee_population" in data
    assert isinstance(data["trends"], list)
