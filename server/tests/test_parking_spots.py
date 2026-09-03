import pytest


def test_search_parking_spots_default(client):
    """Verify search returns all spots by default when category is unselected."""
    response = client.get("/api/v1/parking-spots/search")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_search_parking_spots_category_filter(client):
    """Verify filtering by category 'Car' and 'Bike'."""
    # Filter by Car
    car_res = client.get("/api/v1/parking-spots/search", params={"category": "Car"})
    assert car_res.status_code == 200
    car_data = car_res.json()
    for spot in car_data:
        assert spot["category"].lower() == "car"

    # Filter by Bike
    bike_res = client.get("/api/v1/parking-spots/search", params={"category": "Bike"})
    assert bike_res.status_code == 200
    bike_data = bike_res.json()
    for spot in bike_data:
        assert spot["category"].lower() == "bike"

    # Empty category returns all
    empty_cat_res = client.get("/api/v1/parking-spots/search", params={"category": ""})
    assert empty_cat_res.status_code == 200
    assert len(empty_cat_res.json()) >= len(car_data)


def test_get_spot_details(client):
    """Verify getting single spot details."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()[0]["spot_id"]

    res = client.get(f"/api/v1/parking-spots/{spot_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == spot_id
    assert "name" in data
    assert "address" in data


def test_get_spot_rates(client):
    """Verify getting rate breakdown for a spot."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()[0]["spot_id"]

    res = client.get(f"/api/v1/parking-spots/{spot_id}/rates")
    assert res.status_code == 200
    data = res.json()
    assert data["spot_id"] == spot_id
    assert "base_hourly_rate" in data
    assert "current_active_rate" in data
    assert "rate_breakdown" in data


def test_calculate_cost(client):
    """Verify calculating parking cost."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()[0]["spot_id"]

    res = client.post(
        f"/api/v1/parking-spots/{spot_id}/calculate-cost",
        json={"hours": 3.0},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["spot_id"] == spot_id
    assert data["hours"] == 3.0
    assert data["total_cost"] > 0


def test_update_spot_status(client):
    """Verify updating spot status and available capacity."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()[0]["spot_id"]

    res = client.post(
        f"/api/v1/parking-spots/{spot_id}/status",
        json={"status": "occupied", "available_spots": 0},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "occupied"
    assert data["available_spots"] == 0

    # Verify recent events
    events_res = client.get("/api/v1/parking-spots/events/recent")
    assert events_res.status_code == 200
    events = events_res.json()
    assert len(events) >= 1
    assert events[0]["status"] == "occupied"


def test_health_check(client):
    """Verify healthcheck endpoint."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
