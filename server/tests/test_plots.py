import pytest
from fastapi.testclient import TestClient
from uuid import uuid4


@pytest.fixture
def auth_headers(client: TestClient):
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def plot_type_id(client: TestClient, auth_headers):
    response = client.get("/api/v1/plot-types", headers=auth_headers)
    return response.json()[0]["id"]


def test_plots_crud_lifecycle(client: TestClient, auth_headers, plot_type_id):
    # 1. List plots (should be empty initially)
    response = client.get("/api/v1/plots", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0

    # 2. Create a plot
    plot_data = {
        "plot_type_id": plot_type_id,
        "status": "Available",
        "section": "A",
        "lot": "10",
        "plot_number": "01",
        "dimensions": "3ft x 8ft",
        "capacity": 1,
        "price": 2500.00,
    }
    response = client.post("/api/v1/plots", json=plot_data, headers=auth_headers)
    assert response.status_code == 201
    created_plot = response.json()
    assert created_plot["plot_id"] == "SEC-A-L10-P01"
    assert created_plot["section"] == "A"
    assert created_plot["lot"] == "10"
    assert created_plot["plot_number"] == "01"
    assert created_plot["price"] == 2500.00

    # 3. Get plot details
    plot_uuid = created_plot["id"]
    response = client.get(f"/api/v1/plots/{plot_uuid}", headers=auth_headers)
    assert response.status_code == 200
    detail = response.json()
    assert detail["plot_id"] == "SEC-A-L10-P01"
    assert detail["plot_type"]["id"] == plot_type_id

    # 4. Update plot details
    update_data = {
        "plot_type_id": plot_type_id,
        "status": "Reserved",
        "section": "A",
        "lot": "10",
        "plot_number": "01",
        "dimensions": "3ft x 8ft",
        "capacity": 2,
        "price": 2800.00,
    }
    response = client.put(
        f"/api/v1/plots/{plot_uuid}", json=update_data, headers=auth_headers
    )
    assert response.status_code == 200
    updated_plot = response.json()
    assert updated_plot["status"] == "Reserved"
    assert updated_plot["capacity"] == 2
    assert updated_plot["price"] == 2800.00

    # 5. Filter plots
    response = client.get("/api/v1/plots?status=Reserved", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["id"] == plot_uuid

    response = client.get("/api/v1/plots?status=Available", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0

    # 6. Delete plot
    response = client.delete(f"/api/v1/plots/{plot_uuid}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Plot deleted successfully"

    # 7. Verify deleted
    response = client.get(f"/api/v1/plots/{plot_uuid}", headers=auth_headers)
    assert response.status_code == 404


def test_create_plot_duplicate_location(client: TestClient, auth_headers, plot_type_id):
    plot_data = {
        "plot_type_id": plot_type_id,
        "status": "Available",
        "section": "B",
        "lot": "05",
        "plot_number": "12",
        "dimensions": "3ft x 8ft",
        "capacity": 1,
        "price": 2500.00,
    }
    # Create first plot
    response = client.post("/api/v1/plots", json=plot_data, headers=auth_headers)
    assert response.status_code == 201

    # Try to create second plot at same location
    response = client.post("/api/v1/plots", json=plot_data, headers=auth_headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Plot with this location already exists"


def test_create_plot_invalid_plot_type(client: TestClient, auth_headers):
    plot_data = {
        "plot_type_id": str(uuid4()),
        "status": "Available",
        "section": "C",
        "lot": "01",
        "plot_number": "01",
        "dimensions": "3ft x 8ft",
        "capacity": 1,
        "price": 2500.00,
    }
    response = client.post("/api/v1/plots", json=plot_data, headers=auth_headers)
    assert response.status_code == 422
    assert "Invalid plot_type_id" in response.json()["detail"]


def test_get_nonexistent_plot(client: TestClient, auth_headers):
    response = client.get(f"/api/v1/plots/{uuid4()}", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Plot not found"
