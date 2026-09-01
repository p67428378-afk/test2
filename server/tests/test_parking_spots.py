from server.services.parking_service import haversine_distance, is_peak_hour
from datetime import datetime, time
from server.models.parking import HourlyRate


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_haversine_distance():
    # Distance between SF Downtown (37.7749, -122.4194) and Mission (37.7599, -122.4215)
    dist = haversine_distance(37.7749, -122.4194, 37.7599, -122.4215)
    assert 1.0 < dist < 2.5
    # Same point distance should be 0
    assert haversine_distance(37.7749, -122.4194, 37.7749, -122.4194) == 0.0


def test_is_peak_hour():
    rate = HourlyRate(
        peak_start_time=time(7, 0, 0),
        peak_end_time=time(19, 0, 0),
    )
    # Wednesday 10:00 AM (weekday, peak)
    dt_peak = datetime(2026, 9, 2, 10, 0, 0)
    assert is_peak_hour(rate, dt_peak) is True

    # Wednesday 22:00 PM (weekday, off-peak)
    dt_off_peak = datetime(2026, 9, 2, 22, 0, 0)
    assert is_peak_hour(rate, dt_off_peak) is False

    # Sunday 10:00 AM (weekend, off-peak)
    dt_weekend = datetime(2026, 9, 6, 10, 0, 0)
    assert is_peak_hour(rate, dt_weekend) is False


def test_search_parking_spots_default(client):
    response = client.get("/api/v1/parking-spots/search")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "spots" in data
    assert data["total"] > 0
    assert len(data["spots"]) > 0

    first_spot = data["spots"][0]
    assert "spot_id" in first_spot
    assert "name" in first_spot
    assert "hourly_rate" in first_spot
    assert "distance_km" in first_spot
    assert "available_spots" in first_spot


def test_search_parking_spots_with_coords(client):
    response = client.get(
        "/api/v1/parking-spots/search?lat=37.7751&lng=-122.4180&radius_km=2.0"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    # Check that nearest spot has very small distance
    assert data["spots"][0]["distance_km"] < 0.5


def test_search_parking_spots_with_address(client):
    response = client.get(
        "/api/v1/parking-spots/search?address=Valencia+St&radius_km=5.0"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    # Should include Mission District Lot
    spot_names = [s["name"] for s in data["spots"]]
    assert any("Mission" in name for name in spot_names)


def test_search_parking_spots_filter_max_rate(client):
    response = client.get("/api/v1/parking-spots/search?max_rate=4.00")
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["base_hourly_rate"] <= 4.00 or spot["hourly_rate"] <= 4.00


def test_search_parking_spots_filter_ev_charging(client):
    response = client.get("/api/v1/parking-spots/search?has_ev_charging=true")
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["has_ev_charging"] is True


def test_search_parking_spots_filter_spot_type(client):
    response = client.get("/api/v1/parking-spots/search?spot_type=covered")
    assert response.status_code == 200
    data = response.json()
    for spot in data["spots"]:
        assert spot["spot_type"].lower() == "covered"


def test_search_parking_spots_sort_by_price(client):
    response = client.get("/api/v1/parking-spots/search?sort_by=price")
    assert response.status_code == 200
    data = response.json()
    spots = data["spots"]
    if len(spots) >= 2:
        rates = [s["hourly_rate"] for s in spots]
        assert rates == sorted(rates)


def test_list_spots(client):
    response = client.get("/api/v1/parking-spots")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5


def test_get_spot_details_valid(client):
    spot_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    response = client.get(f"/api/v1/parking-spots/{spot_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["spot_id"] == spot_id
    assert data["name"] == "Downtown Central Garage"
    assert data["total_capacity"] == 50
    assert data["has_ev_charging"] is True


def test_get_spot_details_not_found(client):
    response = client.get("/api/v1/parking-spots/non-existent-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_spot_rates(client):
    spot_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    response = client.get(f"/api/v1/parking-spots/{spot_id}/rates")
    assert response.status_code == 200
    data = response.json()
    assert data["spot_id"] == spot_id
    assert data["base_hourly_rate"] == 5.0
    assert "rate_breakdown" in data
    assert "standard_rate" in data["rate_breakdown"]
    assert "peak_rate" in data["rate_breakdown"]
    assert "weekend_rate" in data["rate_breakdown"]


def test_calculate_parking_cost_standard(client):
    spot_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    payload = {"hours": 3.0, "start_time": "20:00"}
    response = client.post(
        f"/api/v1/parking-spots/{spot_id}/calculate-cost", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["spot_id"] == spot_id
    assert data["hours"] == 3.0
    # Off-peak base rate is 5.0 -> 3 * 5 = 15.0
    assert data["estimated_cost"] == 15.0
    assert data["capped_at_daily_max"] is False


def test_calculate_parking_cost_daily_cap(client):
    spot_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    # 10 hours at peak 8.0/hr = 80.0, but max daily cap is 35.0
    payload = {"hours": 10.0, "start_time": "09:00"}
    response = client.post(
        f"/api/v1/parking-spots/{spot_id}/calculate-cost", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_cost"] == 35.0
    assert data["capped_at_daily_max"] is True


def test_update_spot_status_and_events(client):
    spot_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    payload = {"status": "OCCUPIED", "available_spots": 0}
    response = client.post(f"/api/v1/parking-spots/{spot_id}/status", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OCCUPIED"
    assert data["available_spots"] == 0

    # Verify event logged
    event_res = client.get("/api/v1/parking-spots/events/recent")
    assert event_res.status_code == 200
    events = event_res.json()
    assert len(events) >= 1
    assert any(e["spot_id"] == spot_id for e in events)


def test_create_parking_location(client):
    new_spot = {
        "name": "Civic Center Plaza Garage",
        "address": "355 McAllister St, San Francisco, CA 94102",
        "latitude": 37.7801,
        "longitude": -122.4189,
        "spot_type": "garage",
        "has_ev_charging": True,
        "total_capacity": 60,
        "available_spots": 25,
        "base_rate_per_hour": 4.50,
        "peak_rate_per_hour": 7.50,
        "max_daily_rate": 30.00,
    }
    response = client.post("/api/v1/parking-spots", json=new_spot)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Civic Center Plaza Garage"
    assert data["total_capacity"] == 60
    assert data["base_hourly_rate"] == 4.50
