import pytest
from unittest.mock import patch, MagicMock
from server.models import City, SearchStatistics
from server.services import weather_cache


@pytest.fixture(autouse=True)
def clear_cache():
    weather_cache.clear()


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


@patch("server.services.requests.get")
def test_search_cities_success(mock_get, client, db_session):
    # Mock geocoding API response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {
            "name": "Seattle",
            "lat": 47.6062,
            "lon": -122.3321,
            "country": "US",
            "state": "WA",
        }
    ]
    mock_get.return_value = mock_response

    response = client.get("/api/v1/weather/search?q=Seattle")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Seattle"
    assert data[0]["state"] == "WA"
    assert data[0]["country"] == "US"
    assert data[0]["latitude"] == 47.6062
    assert data[0]["longitude"] == -122.3321

    # Verify city is saved in DB
    city = db_session.query(City).filter(City.name == "Seattle").first()
    assert city is not None
    assert city.state == "WA"

    # Verify search statistics are updated
    stats = (
        db_session.query(SearchStatistics)
        .filter(SearchStatistics.city_id == city.id)
        .first()
    )
    assert stats is not None
    assert stats.search_count == 1


def test_search_cities_empty_query(client):
    response = client.get("/api/v1/weather/search?q= ")
    assert response.status_code == 400
    assert "Search query cannot be empty" in response.json()["detail"]


@patch("server.services.requests.get")
def test_search_cities_api_down_fallback(mock_get, client, db_session):
    # Seed a city first
    city = City(
        id="test-uuid-123",
        name="Vancouver",
        state="BC",
        country="CA",
        latitude=49.2827,
        longitude=-123.1207,
    )
    db_session.add(city)
    db_session.commit()

    # Mock API failure
    mock_get.side_effect = Exception("API is down")

    response = client.get("/api/v1/weather/search?q=Vancouver")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Vancouver"

    # Verify search statistics are updated
    stats = (
        db_session.query(SearchStatistics)
        .filter(SearchStatistics.city_id == city.id)
        .first()
    )
    assert stats is not None
    assert stats.search_count == 1


@patch("server.services.requests.get")
def test_get_weather_forecast_success(mock_get, client):
    # Mock current weather and forecast API responses
    mock_current_resp = MagicMock()
    mock_current_resp.status_code = 200
    mock_current_resp.json.return_value = {
        "main": {"temp": 15.5, "humidity": 60, "pressure": 1013},
        "wind": {"speed": 5.2},
        "weather": [{"description": "scattered clouds", "icon": "03d"}],
    }

    mock_forecast_resp = MagicMock()
    mock_forecast_resp.status_code = 200
    mock_forecast_resp.json.return_value = {
        "list": [
            {
                "dt_txt": "2026-08-25 12:00:00",
                "main": {"temp": 15.5, "temp_max": 18.0, "temp_min": 12.0},
                "weather": [{"description": "scattered clouds", "icon": "03d"}],
            },
            {
                "dt_txt": "2026-08-26 12:00:00",
                "main": {"temp": 16.0, "temp_max": 19.0, "temp_min": 13.0},
                "weather": [{"description": "clear sky", "icon": "01d"}],
            },
        ]
    }

    # Mock requests.get to return current weather first, then forecast
    mock_get.side_effect = [mock_current_resp, mock_forecast_resp]

    response = client.get(
        "/api/v1/weather/forecast?lat=47.6062&lon=-122.3321&units=metric"
    )
    assert response.status_code == 200
    data = response.json()

    assert "current" in data
    assert data["current"]["temp"] == 15.5
    assert data["current"]["description"] == "Scattered Clouds"

    assert "daily_forecasts" in data
    assert len(data["daily_forecasts"]) == 2
    assert data["daily_forecasts"][0]["temp_max"] == 18.0
    assert data["daily_forecasts"][0]["temp_min"] == 12.0

    assert "hourly_forecasts" in data
    assert len(data["hourly_forecasts"]) == 2
    assert data["hourly_forecasts"][0]["temp"] == 15.5


def test_get_weather_forecast_invalid_units(client):
    response = client.get(
        "/api/v1/weather/forecast?lat=47.6062&lon=-122.3321&units=kelvin"
    )
    assert response.status_code == 400
    assert "Units must be either 'metric' or 'imperial'" in response.json()["detail"]


@patch("server.services.requests.get")
def test_get_weather_forecast_api_down_no_cache(mock_get, client):
    # Mock API failure
    mock_get.side_effect = Exception("API is down")

    response = client.get(
        "/api/v1/weather/forecast?lat=47.6062&lon=-122.3321&units=metric"
    )
    assert response.status_code == 503
    assert (
        "External weather service is currently unavailable" in response.json()["detail"]
    )
