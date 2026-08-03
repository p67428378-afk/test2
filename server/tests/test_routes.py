from uuid import uuid4
from server import models


def test_get_routes(client, db):
    # AC: Users must be able to easily search for and select specific bus routes to view on the map.
    # Test fetching all routes
    response = client.get("/api/v1/routes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

    # Verify route numbers are present
    route_numbers = [r["route_number"] for r in data]
    assert "72" in route_numbers
    assert "14" in route_numbers

    # Test search filtering by route number
    response = client.get("/api/v1/routes?search=72")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["route_number"] == "72"

    # Test search filtering by route name
    response = client.get("/api/v1/routes?search=Local")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["route_number"] == "14"


def test_get_route_stops(client, db):
    # AC: The map interface must be intuitive, allowing users to pan, zoom, and tap on bus stops or buses for more information.
    # Fetch Route 72
    route = db.query(models.Route).filter(models.Route.route_number == "72").first()
    assert route is not None

    # Fetch stops for Route 72
    response = client.get(f"/api/v1/routes/{route.id}/stops")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Verify ordering by stop_order
    assert data[0]["stop_order"] == 1
    assert data[1]["stop_order"] == 2
    assert data[0]["stop_name"] == "Main Street & 1st Ave"
    assert data[1]["stop_name"] == "Broadway & 42nd St"

    # Test non-existent route
    response = client.get(f"/api/v1/routes/{uuid4()}/stops")
    assert response.status_code == 404


def test_get_route_buses(client, db):
    # AC: The app must display a map showing the live location of buses for selected routes.
    # Fetch Route 72
    route = db.query(models.Route).filter(models.Route.route_number == "72").first()
    assert route is not None

    # Fetch buses for Route 72
    response = client.get(f"/api/v1/routes/{route.id}/buses")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Verify vehicle IDs and locations
    vehicle_ids = [b["vehicle_id"] for b in data]
    assert "BUS-72-01" in vehicle_ids
    assert "BUS-72-02" in vehicle_ids

    # Verify location structure
    for bus in data:
        assert "location" in bus
        assert "latitude" in bus["location"]
        assert "longitude" in bus["location"]

    # Test non-existent route
    response = client.get(f"/api/v1/routes/{uuid4()}/buses")
    assert response.status_code == 404


def test_get_stop_eta(client, db):
    # AC: For any selected bus stop, the app must display the estimated arrival times for the next two buses on that route.
    # Fetch Stop "Broadway & 42nd St"
    stop = (
        db.query(models.Stop)
        .filter(models.Stop.stop_name == "Broadway & 42nd St")
        .first()
    )
    assert stop is not None

    # Fetch ETA for the stop
    response = client.get(f"/api/v1/stops/{stop.id}/eta")
    assert response.status_code == 200
    data = response.json()
    assert data["stop_name"] == "Broadway & 42nd St"
    assert "etas" in data

    # Verify we have ETAs for the buses
    etas = data["etas"]
    assert len(etas) > 0

    # Verify structure of each ETA
    for eta in etas:
        assert "route_id" in eta
        assert "route_number" in eta
        assert "vehicle_id" in eta
        assert "estimated_arrival_minutes" in eta
        assert eta["estimated_arrival_minutes"] >= 1

    # Test non-existent stop
    response = client.get(f"/api/v1/stops/{uuid4()}/eta")
    assert response.status_code == 404
