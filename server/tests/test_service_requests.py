"""
test_service_requests.py — Tests for the service requests CRUD endpoints.
Uses the shared StaticPool in-memory engine from conftest.py.
"""
from fastapi.testclient import TestClient
from server.main import app
from server.models import EnergySource, Alert, ServiceRequest
from server.tests.conftest import TestingSessionLocal


def _seed_service_request():
    """Seed one alert-linked service request, return the seeded request id."""
    db = TestingSessionLocal()
    try:
        solar = EnergySource(name="Solar Array A", type="solar", status="active")
        db.add(solar)
        db.commit()
        db.refresh(solar)

        alert = Alert(
            energy_source_id=solar.id,
            parameter_name="temperature",
            parameter_value=85.0,
            threshold_value=80.0,
            severity="warning",
            status="active",
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)

        req = ServiceRequest(
            alert_id=alert.id,
            equipment="Solar Panel Array A",
            location="Roof Sector 4",
            description="High Temperature Warning: 85C",
            status="New",
        )
        db.add(req)
        db.commit()
        db.refresh(req)
        return req.id
    finally:
        db.close()


def test_list_service_requests():
    _seed_service_request()
    client = TestClient(app)
    response = client.get("/api/v1/service-requests")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["equipment"] == "Solar Panel Array A"
    assert data[0]["status"] == "New"


def test_create_service_request():
    client = TestClient(app)
    response = client.post(
        "/api/v1/service-requests",
        json={
            "description": "Manual inspection request",
            "equipment": "Wind Turbine B",
            "location": "Field Sector 2",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["equipment"] == "Wind Turbine B"
    assert data["status"] == "New"


def test_update_service_request():
    req_id = _seed_service_request()
    client = TestClient(app)

    response = client.put(
        f"/api/v1/service-requests/{req_id}",
        json={
            "status": "In Progress",
            "comment": "Dispatched to site to inspect cooling fans.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "In Progress"
    assert len(data["activity_log"]) == 1
    assert (
        data["activity_log"][0]["comment"]
        == "Dispatched to site to inspect cooling fans."
    )
