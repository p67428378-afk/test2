import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import SessionLocal, get_db


# Override get_db to use SessionLocal (which has the seeded data)
# and clear any other overrides that might have been set by other test files.
def override_get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_dependency_overrides():
    app.dependency_overrides[get_db] = override_get_db
    yield


def test_get_dashboard_data():
    with TestClient(app) as client:
        response = client.get("/api/v1/assortment/dashboard")
        assert response.status_code == 200
        data = response.json()

        # Verify KPI metrics
        assert "kpi_metrics" in data
        assert data["kpi_metrics"]["in_stock_rate"] == 96.2
        assert data["kpi_metrics"]["private_brand_percent"] == 24.5
        assert data["kpi_metrics"]["sales_per_linear_ft"] == 450.5
        assert data["kpi_metrics"]["shelf_capacity"] == 1200

        # Verify scenarios
        assert "scenarios" in data
        assert len(data["scenarios"]) == 3
        scenario_names = [s["name"] for s in data["scenarios"]]
        assert "Conservative" in scenario_names
        assert "Balanced" in scenario_names
        assert "Aggressive" in scenario_names

        # Verify SKU performance
        assert "sku_performance" in data
        assert len(data["sku_performance"]) > 0
        skus = [s["sku"] for s in data["sku_performance"]]
        assert "SKU-1001" in skus


def test_get_dashboard_data_forbidden():
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/assortment/dashboard", headers={"X-User-Role": "Guest"}
        )
        assert response.status_code == 403
        assert "Access denied" in response.json()["detail"]


def test_submit_assortment_plan_success():
    with TestClient(app) as client:
        payload = {
            "scenario_name": "Balanced",
            "sku_actions": [
                {"sku": "SKU-1001", "action": "GROW"},
                {"sku": "SKU-3104", "action": "GROW"},
            ],
        }
        response = client.post("/api/v1/assortment/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert data["scenario_name"] == "Balanced"
        assert data["sku_actions_count"] == 2
        assert "audit_trail_id" in data
        assert "submitted_at" in data
        assert data["submitted_by"] == "category_manager@dollargeneral.com"


def test_submit_assortment_plan_forbidden():
    with TestClient(app) as client:
        payload = {
            "scenario_name": "Balanced",
            "sku_actions": [{"sku": "SKU-1001", "action": "GROW"}],
        }
        response = client.post(
            "/api/v1/assortment/submit", json=payload, headers={"X-User-Role": "Guest"}
        )
        assert response.status_code == 403
        assert "Access denied" in response.json()["detail"]


def test_submit_assortment_plan_invalid_scenario():
    with TestClient(app) as client:
        payload = {
            "scenario_name": "SuperAggressive",
            "sku_actions": [{"sku": "SKU-1001", "action": "GROW"}],
        }
        response = client.post("/api/v1/assortment/submit", json=payload)
        assert response.status_code == 400
        assert "Invalid scenario name" in response.json()["detail"]


def test_submit_assortment_plan_empty_actions():
    with TestClient(app) as client:
        payload = {"scenario_name": "Balanced", "sku_actions": []}
        response = client.post("/api/v1/assortment/submit", json=payload)
        assert response.status_code == 400
        assert "SKU actions list cannot be empty" in response.json()["detail"]
