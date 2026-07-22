import pytest
from datetime import datetime


@pytest.fixture
def auth_headers(client):
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "hiveuser",
            "email": "hiveuser@example.com",
            "password": "password123",
        },
    )
    response = client.post(
        "/api/v1/auth/login", json={"username": "hiveuser", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_hive(client, auth_headers):
    response = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Alpha",
            "location": "North Orchard",
            "status": "healthy",
            "honey_capacity_pct": 45.5,
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Hive Alpha"
    assert data["location"] == "North Orchard"
    assert data["status"] == "healthy"
    assert data["honey_capacity_pct"] == 45.5
    assert "id" in data


def test_get_hives(client, auth_headers):
    # Create a hive first
    client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Beta",
            "location": "South Field",
            "status": "healthy",
            "honey_capacity_pct": 10.0,
        },
        headers=auth_headers,
    )

    response = client.get("/api/v1/hives", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Hive Beta"
    assert "latest_sensor_data" in data[0]


def test_get_hive_detail(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Gamma",
            "location": "East Garden",
            "status": "healthy",
            "honey_capacity_pct": 20.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    response = client.get(f"/api/v1/hives/{hive_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Hive Gamma"
    assert "sensor_history_24h" in data
    assert "production_logs" in data
    assert "population_logs" in data
    assert "inspections" in data
    assert "disease_reports" in data


def test_post_sensor_data(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Delta",
            "location": "West Woods",
            "status": "healthy",
            "honey_capacity_pct": 30.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    timestamp_str = datetime.utcnow().isoformat()
    response = client.post(
        f"/api/v1/hives/{hive_id}/sensor-data",
        json={"temperature": 34.5, "humidity": 58.2, "timestamp": timestamp_str},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["temperature"] == 34.5
    assert data["humidity"] == 58.2
    assert "id" in data


def test_create_production_log(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Epsilon",
            "location": "Hillside",
            "status": "healthy",
            "honey_capacity_pct": 50.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    response = client.post(
        f"/api/v1/hives/{hive_id}/production-logs",
        json={"date": "2026-07-22", "quantity_kg": 12.4},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["quantity_kg"] == 12.4
    assert data["date"] == "2026-07-22"


def test_create_population_log(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Zeta",
            "location": "Valley",
            "status": "healthy",
            "honey_capacity_pct": 60.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    response = client.post(
        f"/api/v1/hives/{hive_id}/population-logs",
        json={"date": "2026-07-22", "estimated_population": 45000},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["estimated_population"] == 45000
    assert data["date"] == "2026-07-22"


def test_create_inspection(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Eta",
            "location": "Creek",
            "status": "healthy",
            "honey_capacity_pct": 70.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    response = client.post(
        f"/api/v1/hives/{hive_id}/inspections",
        json={
            "inspection_date": "2026-07-23",
            "inspector": "Marcus Vance",
            "focus_area": "Queen health",
            "notes": "Queen is active and laying eggs.",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["inspection_date"] == "2026-07-23"
    assert data["inspector"] == "Marcus Vance"
    assert data["focus_area"] == "Queen health"
    assert data["notes"] == "Queen is active and laying eggs."


def test_create_disease_report(client, auth_headers):
    # Create a hive
    create_resp = client.post(
        "/api/v1/hives",
        json={
            "name": "Hive Theta",
            "location": "Ridge",
            "status": "healthy",
            "honey_capacity_pct": 80.0,
        },
        headers=auth_headers,
    )
    hive_id = create_resp.json()["id"]

    response = client.post(
        f"/api/v1/hives/{hive_id}/disease-reports",
        json={
            "report_date": "2026-07-22",
            "symptoms": "Mites on bees",
            "severity": "low",
            "observations": "Minor Varroa mite presence",
            "status": "monitoring",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["report_date"] == "2026-07-22"
    assert data["symptoms"] == "Mites on bees"
    assert data["severity"] == "low"
    assert data["observations"] == "Minor Varroa mite presence"
    assert data["status"] == "monitoring"
