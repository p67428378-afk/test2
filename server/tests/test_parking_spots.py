from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "parking-locator-api"


def test_search_open_parking_spots_by_coords(client: TestClient):
    """AC 1: Search for available parking spots using geolocation (lat/lng)."""
    response = client.get(
        "/api/v1/parking-spots/search",
        params={"lat": 37.7749, "lng": -122.4194, "radius_km": 5.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "spots" in data
    assert data["total"] > 0

    first_spot = data["spots"][0]
    assert "spot_id" in first_spot
    assert "name" in first_spot
    assert "address" in first_spot
    assert "latitude" in first_spot
    assert "longitude" in first_spot
    assert "hourly_rate" in first_spot
    assert "distance_km" in first_spot
    assert "status" in first_spot


def test_search_open_parking_spots_by_address(client: TestClient):
    """AC 1: Search by entering an address string."""
    response = client.get(
        "/api/v1/parking-spots/search",
        params={"address": "123 Main St, San Francisco, CA"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    # Downtown Central Garage should be nearest
    spot_names = [s["name"] for s in data["spots"]]
    assert any("Downtown" in name or "Garage" in name for name in spot_names)


def test_get_hourly_rates_and_breakdown(client: TestClient):
    """AC 2: Display clear, up-to-date hourly rates and peak/off-peak breakdown."""
    # Find a spot ID first
    search_res = client.get(
        "/api/v1/parking-spots/search", params={"lat": 37.7749, "lng": -122.4194}
    )
    spot_id = search_res.json()["spots"][0]["spot_id"]

    rates_res = client.get(f"/api/v1/parking-spots/{spot_id}/rates")
    assert rates_res.status_code == 200
    rate_data = rates_res.json()
    assert rate_data["spot_id"] == spot_id
    assert "base_hourly_rate" in rate_data
    assert "current_active_rate" in rate_data
    assert "rate_breakdown" in rate_data
    assert "standard_rate" in rate_data["rate_breakdown"]
    assert "peak_rate" in rate_data["rate_breakdown"]
    assert "weekend_rate" in rate_data["rate_breakdown"]
    assert "max_daily_cap" in rate_data


def test_filter_by_max_price(client: TestClient):
    """AC 3: Users can filter parking spots by price/hourly rate."""
    response = client.get(
        "/api/v1/parking-spots/search",
        params={"lat": 37.7749, "lng": -122.4194, "max_rate": 6.5},
    )
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["hourly_rate"] <= 6.5


def test_filter_by_spot_type_and_ev(client: TestClient):
    """AC 3: Filter by spot type and EV charging."""
    response = client.get(
        "/api/v1/parking-spots/search",
        params={"spot_type": "covered", "has_ev_charging": True},
    )
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["spot_type"] == "covered"
        assert spot["has_ev_charging"] is True


def test_sort_options(client: TestClient):
    """AC 3: Sort spots by price, distance, and name."""
    # Sort by price
    price_res = client.get("/api/v1/parking-spots/search", params={"sort_by": "price"})
    assert price_res.status_code == 200
    rates = [s["hourly_rate"] for s in price_res.json()["spots"]]
    assert rates == sorted(rates)

    # Sort by distance
    dist_res = client.get(
        "/api/v1/parking-spots/search",
        params={"lat": 37.7749, "lng": -122.4194, "sort_by": "distance"},
    )
    assert dist_res.status_code == 200
    distances = [s["distance_km"] for s in dist_res.json()["spots"]]
    assert distances == sorted(distances)


def test_realtime_status_update_and_events(client: TestClient):
    """AC 4: Ingest real-time spot status changes and verify state transition."""
    # Search for a spot
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()["spots"][0]["spot_id"]

    # Ingest OCCUPIED status
    update_res = client.post(
        f"/api/v1/parking-spots/{spot_id}/status",
        json={"status": "OCCUPIED", "available_spots": 0},
    )
    assert update_res.status_code == 200
    assert update_res.json()["data"]["status"] == "OCCUPIED"
    assert update_res.json()["data"]["available_spots"] == 0

    # Ingest AVAILABLE status with updated spot count
    update_res2 = client.post(
        f"/api/v1/parking-spots/{spot_id}/status",
        json={"status": "AVAILABLE", "available_spots": 5},
    )
    assert update_res2.status_code == 200
    assert update_res2.json()["data"]["status"] == "AVAILABLE"
    assert update_res2.json()["data"]["available_spots"] == 5

    # Check recent events telemetry
    events_res = client.get("/api/v1/parking-spots/events/recent")
    assert events_res.status_code == 200
    events = events_res.json()
    assert len(events) > 0
    assert events[0]["event"] == "SPOT_STATUS_CHANGED"


def test_calculate_parking_cost_duration(client: TestClient):
    """Cost estimation slider calculation endpoint."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()["spots"][0]["spot_id"]

    calc_res = client.post(
        f"/api/v1/parking-spots/{spot_id}/calculate-cost",
        json={"hours": 3.0, "start_time": "2026-09-01T10:00:00Z"},
    )
    assert calc_res.status_code == 200
    calc_data = calc_res.json()
    assert calc_data["spot_id"] == spot_id
    assert calc_data["requested_hours"] == 3.0
    assert calc_data["estimated_cost"] > 0
    assert "capped_at_daily_max" in calc_data


def test_get_spot_details_and_not_found(client: TestClient):
    """Retrieve full spot details and test 404 for non-existent ID."""
    search_res = client.get("/api/v1/parking-spots/search")
    spot_id = search_res.json()["spots"][0]["spot_id"]

    detail_res = client.get(f"/api/v1/parking-spots/{spot_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == spot_id
    assert "total_capacity" in detail
    assert "available_spots" in detail
    assert "rates" in detail

    # 404 test
    not_found = client.get("/api/v1/parking-spots/00000000-0000-0000-0000-000000000000")
    assert not_found.status_code == 404


def test_create_parking_location(client: TestClient):
    """Create a new parking facility."""
    new_spot = {
        "name": "SOMA Test Garage",
        "address": "999 Folsom St, San Francisco, CA 94103",
        "latitude": 37.7780,
        "longitude": -122.4050,
        "spot_type": "garage",
        "has_ev_charging": True,
        "total_capacity": 40,
        "available_spots": 15,
        "base_hourly_rate": 5.5,
        "peak_rate_per_hour": 9.0,
        "weekend_rate_per_hour": 6.5,
        "max_daily_rate": 40.0,
    }
    create_res = client.post("/api/v1/parking-spots", json=new_spot)
    assert create_res.status_code == 201
    assert "id" in create_res.json()


def test_websocket_connection(client: TestClient):
    """Test WebSocket connection and handshake for real-time stream."""
    with client.websocket_connect("/api/v1/parking-spots/live-updates") as websocket:
        data = websocket.receive_json()
        assert data["event"] == "CONNECTED"
        websocket.send_text("ping")
        response = websocket.receive_text()
        assert response == "pong"
