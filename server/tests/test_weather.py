from server.models.search_history import SearchHistory
from server.services.cache_service import cache_service


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_get_current_weather_default(client):
    """Test default location fallback (New York)."""
    response = client.get("/api/v1/weather/current")
    assert response.status_code == 200
    data = response.json()
    assert "location" in data
    assert data["location"]["name"] == "New York"
    assert "current" in data
    assert "temperature" in data["current"]
    assert data["current"]["unit"] == "fahrenheit"
    assert data["current"]["condition"] in ["Sunny", "Clear", "Partly Cloudy"]
    assert "humidity_percent" in data["current"]
    assert "wind_speed_mph" in data["current"]


def test_get_current_weather_searched_city(client):
    """Test current weather for London."""
    response = client.get("/api/v1/weather/current?location=London")
    assert response.status_code == 200
    data = response.json()
    assert data["location"]["name"] == "London"
    assert data["location"]["country"] == "United Kingdom"


def test_get_current_weather_coordinates(client):
    """Test current weather with lat/lon parameters."""
    response = client.get("/api/v1/weather/current?lat=35.6762&lon=139.6503")
    assert response.status_code == 200
    data = response.json()
    assert "location" in data
    assert abs(data["location"]["latitude"] - 35.6762) < 0.01


def test_get_current_weather_celsius_conversion(client):
    """Test temperature unit conversion to Celsius."""
    cache_service.clear()
    res_f = client.get("/api/v1/weather/current?location=Chicago&unit=fahrenheit")
    res_c = client.get("/api/v1/weather/current?location=Chicago&unit=celsius")

    assert res_f.status_code == 200
    assert res_c.status_code == 200

    f_data = res_f.json()
    c_data = res_c.json()

    assert f_data["current"]["unit"] == "fahrenheit"
    assert c_data["current"]["unit"] == "celsius"
    # Celsius temp should equal (F - 32) * 5/9 roughly
    expected_c = round((f_data["current"]["temperature"] - 32) * 5 / 9, 1)
    assert abs(c_data["current"]["temperature"] - expected_c) <= 0.5


def test_get_forecast_default_7_days(client):
    """Test multi-day forecast defaults to 7 days."""
    response = client.get("/api/v1/weather/forecast?location=New York")
    assert response.status_code == 200
    data = response.json()
    assert len(data["forecast"]) == 7
    first_day = data["forecast"][0]
    assert "date" in first_day
    assert "day_name" in first_day
    assert "temp_high" in first_day
    assert "temp_low" in first_day
    assert "precipitation_chance_percent" in first_day
    assert "humidity_percent" in first_day
    assert "condition_icon" in first_day


def test_get_forecast_custom_days(client):
    """Test forecast with custom days parameter."""
    response = client.get("/api/v1/weather/forecast?location=Tokyo&days=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["forecast"]) == 3


def test_get_trends_24h(client):
    """Test 24-hour temperature trend data points and summary."""
    response = client.get("/api/v1/weather/trends?location=San Francisco&timeframe=24h")
    assert response.status_code == 200
    data = response.json()
    assert data["timeframe"] == "24h"
    assert len(data["trend_points"]) == 24
    first_pt = data["trend_points"][0]
    assert "timestamp" in first_pt
    assert "time_label" in first_pt
    assert "temperature" in first_pt
    assert "condition" in first_pt

    # Summary callouts
    assert "summary" in data
    assert "peak_high" in data["summary"]
    assert "overnight_low" in data["summary"]
    assert data["summary"]["peak_high"] >= data["summary"]["overnight_low"]


def test_get_trends_7d(client):
    """Test 7-day temperature trend data points."""
    response = client.get(
        "/api/v1/weather/trends?location=Paris&timeframe=7d&unit=celsius"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["timeframe"] == "7d"
    assert data["unit"] == "celsius"
    assert len(data["trend_points"]) == 7


def test_search_locations_city(client, db_session):
    """Test location search by city name."""
    response = client.get("/api/v1/weather/locations/search?query=San")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) >= 1
    assert any("San Francisco" in loc["name"] for loc in data["results"])

    # Verify search query is logged in search_history
    history_records = (
        db_session.query(SearchHistory)
        .filter(SearchHistory.search_query == "San")
        .all()
    )
    assert len(history_records) >= 1


def test_search_locations_zip_code(client):
    """Test location search by zip code."""
    response = client.get("/api/v1/weather/locations/search?query=10001")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) >= 1
    assert data["results"][0]["name"] == "New York"


def test_search_locations_empty_query_validation(client):
    """Test empty query parameter validation."""
    response = client.get("/api/v1/weather/locations/search?query=")
    assert response.status_code in [400, 422]


def test_cache_service_functionality():
    """Unit test for cache service TTL and invalidate."""
    cache_service.clear()
    cache_service.set("test_key", {"data": 123}, ttl_seconds=10)
    assert cache_service.get("test_key") == {"data": 123}

    cache_service.invalidate("test_key")
    assert cache_service.get("test_key") is None
