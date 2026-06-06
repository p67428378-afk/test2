import pytest
from fastapi.testclient import TestClient

def test_get_kpis(client: TestClient):
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate" in data
    assert data["in_stock_rate"] == 96.8
    assert "private_brand_percentage" in data
    assert data["private_brand_percentage"] == 24.5

def test_get_skus_performance(client: TestClient):
    response = client.get("/api/v1/skus/performance")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["sku_id"] == "SKU-40129"
    assert data[0]["status"] == "GROW"

def test_get_scenarios_projections(client: TestClient):
    response = client.get("/api/v1/scenarios/projections")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["type"] == "Conservative"
    assert data[1]["type"] == "Balanced"
    assert data[2]["type"] == "Aggressive"

def test_create_and_get_scenario(client: TestClient):
    # Create a scenario
    payload = {
        "name": "Test Balanced Scenario",
        "description": "A test scenario",
        "strategy_type": "Balanced"
    }
    response = client.post("/api/v1/scenarios", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Balanced Scenario"
    assert data["strategy_type"] == "Balanced"
    assert data["is_submitted"] is False
    scenario_id = data["id"]

    # Get scenario details
    response = client.get(f"/api/v1/scenarios/{scenario_id}")
    assert response.status_code == 200
    detail_data = response.json()
    assert detail_data["name"] == "Test Balanced Scenario"
    assert "guardrails" in detail_data
    assert detail_data["guardrails"]["in_stock_ok"] is True
    assert len(detail_data["sku_actions"]) == 5

def test_submit_scenario_and_get_audits(client: TestClient):
    # Create a scenario
    payload = {
        "name": "Submit Test Scenario",
        "description": "A test scenario for submission",
        "strategy_type": "Aggressive"
    }
    response = client.post("/api/v1/scenarios", json=payload)
    assert response.status_code == 201
    scenario_id = response.json()["id"]

    # Submit the scenario
    response = client.post(f"/api/v1/scenarios/{scenario_id}/submit")
    assert response.status_code == 200
    submit_data = response.json()
    assert submit_data["success"] is True
    assert "audit_id" in submit_data

    # Try to submit again (should fail)
    response = client.post(f"/api/v1/scenarios/{scenario_id}/submit")
    assert response.status_code == 400

    # Get audits
    response = client.get("/api/v1/audits")
    assert response.status_code == 200
    audits = response.json()
    assert len(audits) >= 1
    assert audits[-1]["scenario_id"] == scenario_id
    assert audits[-1]["status"] == "APPROVED"

def test_get_nonexistent_scenario(client: TestClient):
    response = client.get("/api/v1/scenarios/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 404

def test_submit_nonexistent_scenario(client: TestClient):
    response = client.post("/api/v1/scenarios/3fa85f64-5717-4562-b3fc-2c963f66afa6/submit")
    assert response.status_code == 404
