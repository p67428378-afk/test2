from fastapi.testclient import TestClient
from server.main import app
from server.tests.test_users_api import get_auth_token

client = TestClient(app)

def test_get_warnings():
    token = get_auth_token()
    response = client.get("/api/v1/warnings", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []

def test_issue_warning():
    token = get_auth_token()
    polygon_coords = [[-105.0, 40.0], [-105.0, 40.5], [-104.5, 40.5], [-104.5, 40.0], [-105.0, 40.0]]
    warning_data = {
        "warning_type": "Tornado Warning",
        "severity": "Extreme",
        "start_time": "2024-01-01T00:00:00",
        "end_time": "2024-01-01T01:00:00",
        "polygon_coords": polygon_coords,
        "details": "Tornado spotted"
    }
    response = client.post("/api/v1/warnings", json=warning_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["status"] == "issued"

def test_update_warning():
    token = get_auth_token()
    # First, create a warning to update
    polygon_coords = [[-105.0, 40.0], [-105.0, 40.5], [-104.5, 40.5], [-104.5, 40.0], [-105.0, 40.0]]
    warning_data = {
        "warning_type": "Tornado Warning",
        "severity": "Extreme",
        "start_time": "2024-01-01T00:00:00",
        "end_time": "2024-01-01T01:00:00",
        "polygon_coords": polygon_coords,
        "details": "Tornado spotted"
    }
    create_response = client.post("/api/v1/warnings", json=warning_data, headers={"Authorization": f"Bearer {token}"})
    warning_id = create_response.json()["id"]

    update_data = {
        "action": "cancel",
        "reason": "Threat has passed"
    }
    response = client.put(f"/api/v1/warnings/{warning_id}", json=update_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == warning_id
    assert data["status"] == "cancel"
