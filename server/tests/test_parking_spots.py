import pytest
from fastapi.testclient import TestClient


def test_search_open_parking_spots_by_address(client: TestClient):
    # AC: Search Open Parking Spots - User searches by address to find nearby spots
    response = client.get("/api/v1/parking-spots/search", params={"address": "123 Main St, San Francisco, CA"})
    assert response.status_code == 200
    data = response.json()
    assert "spots" in data
    assert "total" in data
    assert data["total"] > 0
    first_spot = data["spots"][0]
    assert "spot_id" in first_spot
    assert "name" in first_spot
    assert "hourly_rate" in first_spot
    assert "distance_km" in first_spot
    assert "available_spots" in first_spot


def test_search_open_parking_spots_by_coordinates(client: TestClient):
    # AC: Search Open Parking Spots - User searches by lat/lng geolocation
    response = client.get("/api/v1/parking-spots/search", params={"lat": 37.7750, "lng": -122.4185, "radius_km": 5.0})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    for spot in data["spots"]:
        assert spot["distance_km"] <= 5.0


def test_display_hourly_rates_and_breakdown(client: TestClient):
    # AC: Display Hourly Rates - System displays clear hourly rates and peak/off-peak breakdown
    search_res = client.get("/api/v1/parking-spots/search")
    assert search_res.status_code == 200
    spots = search_res.json()["spots"]
    assert len(spots) > 0
    spot_id = spots[0]["spot_id"]

    rates_res = client.get(f"/api/v1/parking-spots/{spot_id}/rates")
    assert rates_res.status_code == 200
    rates_data = rates_res.json()
    assert rates_data["spot_id"] == spot_id
    assert "base_hourly_rate" in rates_data
    assert "rate_breakdown" in rates_data
    assert "standard_rate" in rates_data["rate_breakdown"]
    assert "peak_rate" in rates_data["rate_breakdown"]
    assert "current_active_rate" in rates_data


def test_filter_spots_by_max_rate(client: TestClient):
    # AC: Filter and Sort Options - Filter parking spots under max hourly rate
    response = client.get("/api/v1/parking-spots/search", params={"max_rate": 6.00})
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["hourly_rate"] <= 6.00


def test_filter_spots_by_amenities_and_type(client: TestClient):
    # AC: Filter and Sort Options - Filter by spot_type and EV charging
    response = client.get("/api/v1/parking-spots/search", params={"spot_type": "garage", "has_ev_charging": True})
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["spot_type"] == "garage"
        assert spot["has_ev_charging"] is True


def test_sort_spots_by_price_and_distance(client: TestClient):
    # AC: Filter and Sort Options - Sort results by price and distance
    price_res = client.get("/api/v1/parking-spots/search", params={"sort_by": "price"})
    assert price_res.status_code == 200
    price_spots = price_res.json()["spots"]
    rates = [s["hourly_rate"] for s in price_spots]
    assert rates == sorted(rates)

    dist_res = client.get("/api/v1/parking-spots/search", params={"sort_by": "distance"})
    assert dist_res.status_code == 200
    dist_spots = dist_res.json()["spots"]
    distances = [s["distance_km"] for s in dist_spots]
    assert distances == sorted(distances)


def test_real_time_availability_status_update(client: TestClient):
    # AC: Real-Time Availability Updates - Update spot availability status to prevent directing to full lots
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()["spots"][0]["spot_id"]

    # Update spot availability count to 0 (Occupied)
    update_res = client.post(
        f"/api/v1/parking-spots/{spot_id}/status",
        json={"status": "OCCUPIED", "available_spots": 0},
    )
    assert update_res.status_code == 200
    update_data = update_res.json()
    assert update_data["status"] == "OCCUPIED"
    assert update_data["available_spots"] == 0

    # Verify spot detail reflects updated status
    detail_res = client.get(f"/api/v1/parking-spots/{spot_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["status"] == "OCCUPIED"
    assert detail_res.json()["available_spots"] == 0

    # Verify event appears in recent events
    events_res = client.get("/api/v1/parking-spots/events/recent")
    assert events_res.status_code == 200
    events = events_res.json()
    assert len(events) > 0
    assert any(e["spot_id"] == spot_id for e in events)


def test_get_spot_details_not_found(client: TestClient):
    response = client.get("/api/v1/parking-spots/non-existent-id")
    assert response.status_code == 404


def test_calculate_cost(client: TestClient):
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()["spots"][0]["spot_id"]

    cost_res = client.post(
        f"/api/v1/parking-spots/{spot_id}/calculate-cost",
        json={"hours": 3.0},
    )
    assert cost_res.status_code == 200
    cost_data = cost_res.json()
    assert cost_data["spot_id"] == spot_id
    assert cost_data["hours"] == 3.0
    assert cost_data["estimated_cost"] > 0
    assert "breakdown" in cost_data


def test_create_parking_location(client: TestClient):
    payload = {
        "name": "SoMa Tech Garage",
        "address": "500 Howard St, San Francisco, CA",
        "latitude": 37.7890,
        "longitude": -122.3980,
        "spot_type": "garage",
        "has_ev_charging": True,
        "total_capacity": 30,
        "base_rate_per_hour": 6.50,
        "peak_rate_per_hour": 10.00,
        "weekend_rate_per_hour": 7.00,
        "max_daily_rate": 38.00,
    }
    response = client.post("/api/v1/parking-spots", json=payload)
    assert response.status_code == 201
    created_loc = response.json()
    assert created_loc["name"] == payload["name"]
    assert created_loc["total_capacity"] == 30
    assert created_loc["available_spots"] == 30


def test_websocket_live_updates(client: TestClient):
    with client.websocket_connect("/api/v1/parking-spots/live-updates") as websocket:
        websocket.send_text("ping")
        # Connection established successfully
