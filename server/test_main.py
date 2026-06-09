import pytest
from fastapi.testclient import TestClient

from server.database import Base, engine, SessionLocal, get_db
from server.main import app
from server.seed import seed_db
from server.models import Product, Scenario, ScenarioItem, Approval
from server import crud

@pytest.fixture(scope="function")
def db():
    # Recreate tables on the shared file-based database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_db(session)
    except Exception as e:
        session.close()
        raise e
    yield session
    session.close()

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the DG Cluster Assortment Advisor API"}


def test_get_dashboard_kpis(client):
    response = client.get("/api/v1/dashboard/kpis")
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()
    assert "sales_linear_ft" in data
    assert "private_brand_pct" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data
    assert data["sales_linear_ft"] > 0
    assert data["private_brand_pct"] > 0
    assert data["in_stock_rate"] == 100.0


def test_get_dashboard_skus(client):
    response = client.get("/api/v1/dashboard/skus")
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()
    assert len(data) == 7
    assert data[0]["sku"] == "CV-POT-01"
    assert data[0]["status"] == "GROW"


def test_get_scenarios(client):
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()
    assert len(data) == 3
    
    balanced = next(s for s in data if s["scenario_id"] == "balanced")
    assert balanced["name"] == "Balanced"
    assert len(balanced["items_to_add"]) == 1
    assert len(balanced["items_to_remove"]) == 1


def test_select_scenario(client):
    response = client.post("/api/v1/scenarios/select", json={"scenario_id": "conservative"})
    assert response.status_code == 200, f"Error: {response.text}"
    assert response.json() == {
        "selected_scenario_id": "conservative",
        "success": True
    }

    response = client.post("/api/v1/scenarios/select", json={"scenario_id": "invalid"})
    assert response.status_code == 400
    assert "Invalid scenario ID" in response.json()["detail"]


def test_submit_approval_success(client):
    response = client.post("/api/v1/approvals", json={
        "scenario_id": "balanced",
        "approver_name": "John Doe"
    })
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()
    assert data["success"] is True
    assert data["approver_name"] == "John Doe"
    assert data["selected_scenario"] == "balanced"
    assert data["guardrail_status"] == {
        "new_sku_limit_check": "PASS",
        "private_brand_check": "PASS",
        "shelf_space_check": "PASS"
    }


def test_submit_approval_fail_private_brand(client):
    response = client.post("/api/v1/approvals", json={
        "scenario_id": "conservative",
        "approver_name": "John Doe"
    })
    assert response.status_code == 400
    assert "Guardrail check failed" in response.json()["detail"]


def test_submit_approval_fail_sku_limit(client):
    response = client.post("/api/v1/approvals", json={
        "scenario_id": "aggressive",
        "approver_name": "John Doe"
    })
    assert response.status_code == 400
    assert "Guardrail check failed" in response.json()["detail"]
