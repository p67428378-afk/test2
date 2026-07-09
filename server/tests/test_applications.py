import pytest
from fastapi.testclient import TestClient
from server.main import app


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    with TestClient(app) as client:
        yield client


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    login_data = {"email": "admin@example.com", "password": "adminpassword"}
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]


def test_applications_workflow(client, admin_token):
    # Create a pet first
    pet_data = {
        "name": "Max",
        "breed": "German Shepherd",
        "age": 3.0,
        "location": "Los Angeles",
        "status": "Available",
        "photo_url": "http://example.com/max.jpg",
        "description": "Energetic and loyal.",
    }
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post("/api/v1/pets/admin/pets", json=pet_data, headers=headers)
    assert response.status_code == 201
    pet_id = response.json()["id"]

    # Submit adoption application
    app_data = {
        "pet_id": pet_id,
        "applicant_name": "John Doe",
        "applicant_email": "john@example.com",
        "applicant_phone": "123-456-7890",
        "reason": "I love dogs and have a big yard.",
        "has_other_pets": False,
        "visit_date": "2026-08-15",
        "visit_time": "10:00 AM",
    }
    response = client.post("/api/v1/applications", json=app_data)
    assert response.status_code == 201
    app_res = response.json()
    assert app_res["status"] == "Pending"
    assert "id" in app_res
    app_id = app_res["id"]

    # Submit application for non-existent pet
    app_data["pet_id"] = "00000000-0000-0000-0000-000000000000"
    response = client.post("/api/v1/applications", json=app_data)
    assert response.status_code == 404

    # List applications as admin
    response = client.get("/api/v1/applications/admin/applications", headers=headers)
    assert response.status_code == 200
    apps_list = response.json()["items"]
    assert len(apps_list) >= 1
    assert any(a["id"] == app_id for a in apps_list)

    # Update application status as admin
    status_data = {"status": "Approved"}
    response = client.put(
        f"/api/v1/applications/admin/applications/{app_id}",
        json=status_data,
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Approved"
