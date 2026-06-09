import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, get_db
from server import models
import uuid
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Generate a unique database file name for this test run
DB_FILE = f"./test_temp_{uuid.uuid4().hex}.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True, scope="module")
def setup_db():
    # Force override get_db for this test module
    app.dependency_overrides[get_db] = override_get_db
    
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        # Seed SKUs
        if db.query(models.SKU).count() == 0:
            skus = [
                models.SKU(
                    sku_id="10482000-0000-0000-0000-000000000000",
                    name="Clover Valley Potato Chips 10oz",
                    brand="Private Brand",
                    sales=14250.00,
                    units=1200,
                    profit=5486.25,
                    gm_pct=38.5,
                    status_badge="GROW"
                ),
                models.SKU(
                    sku_id="20941000-0000-0000-0000-000000000000",
                    name="Lay's Classic Potato Chips 13oz",
                    brand="National Brand",
                    sales=28400.00,
                    units=2400,
                    profit=6248.00,
                    gm_pct=22.0,
                    status_badge="MAINTAIN"
                ),
                models.SKU(
                    sku_id="30291000-0000-0000-0000-000000000000",
                    name="Clover Valley Tortilla Chips 12oz",
                    brand="Private Brand",
                    sales=8120.00,
                    units=800,
                    profit=2842.00,
                    gm_pct=35.0,
                    status_badge="GROW"
                ),
                models.SKU(
                    sku_id="40182000-0000-0000-0000-000000000000",
                    name="Pringles Sour Cream & Onion 5.5oz",
                    brand="National Brand",
                    sales=11500.00,
                    units=1000,
                    profit=2817.50,
                    gm_pct=24.5,
                    status_badge="MAINTAIN"
                ),
                models.SKU(
                    sku_id="50281000-0000-0000-0000-000000000000",
                    name="Generic Cheese Balls 8oz",
                    brand="National Brand",
                    sales=2100.00,
                    units=300,
                    profit=378.00,
                    gm_pct=18.0,
                    status_badge="SWAP"
                ),
                models.SKU(
                    sku_id="60392000-0000-0000-0000-000000000000",
                    name="Clover Valley Pretzels 16oz",
                    brand="Private Brand",
                    sales=1850.00,
                    units=250,
                    profit=277.50,
                    gm_pct=15.0,
                    status_badge="REDUCE"
                )
            ]
            for sku in skus:
                db.add(sku)
                db.commit()

        # Seed Scenarios
        if db.query(models.Scenario).count() == 0:
            scenarios = [
                models.Scenario(
                    scenario_id="b0000000-0000-0000-0000-000000000002",
                    name="Balanced",
                    projected_sales=66220.00,
                    change_in_private_brand_pct=2.4,
                    shelf_utilization_pct=88.2,
                    is_selected=True
                ),
                models.Scenario(
                    scenario_id="c0000000-0000-0000-0000-000000000001",
                    name="Conservative",
                    projected_sales=62000.00,
                    change_in_private_brand_pct=1.5,
                    shelf_utilization_pct=82.0,
                    is_selected=False
                ),
                models.Scenario(
                    scenario_id="a0000000-0000-0000-0000-000000000003",
                    name="Aggressive",
                    projected_sales=71500.00,
                    change_in_private_brand_pct=-0.8,
                    shelf_utilization_pct=94.5,
                    is_selected=False
                )
            ]
            for scenario in scenarios:
                db.add(scenario)
                db.commit()
    finally:
        db.close()
    yield
    # Clean up override after tests in this module
    if get_db in app.dependency_overrides:
        del app.dependency_overrides[get_db]
    
    # Dispose engine to release file locks
    engine.dispose()
    
    # Clean up database file
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
        except Exception:
            pass

client = TestClient(app)

def test_get_dashboard_kpis():
    response = client.get("/api/v1/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate_pct" in data
    assert "private_brand_pct" in data
    assert "sales_per_linear_ft" in data
    assert "shelf_capacity_pct" in data
    assert data["in_stock_rate_pct"] == 96.8

def test_get_sku_performance():
    response = client.get("/api/v1/dashboard/sku-performance")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) > 0
    assert data["items"][0]["name"] == "Lay's Classic Potato Chips 13oz"

def test_get_sku_performance_filter():
    response = client.get("/api/v1/dashboard/sku-performance?filter=Clover")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert "Clover" in item["name"] or "Private Brand" in item["brand"]

def test_get_default_scenarios():
    response = client.get("/api/v1/scenarios/default")
    assert response.status_code == 200
    data = response.json()
    assert "scenarios" in data
    assert len(data["scenarios"]) == 3
    names = [s["name"] for s in data["scenarios"]]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names

def test_recalculate_scenario():
    scenario_id = "b0000000-0000-0000-0000-000000000002"
    payload = {
        "scenario_id": scenario_id,
        "name": "Balanced",
        "adjustments": [
            {"sku_id": "10482000-0000-0000-0000-000000000000", "action": "ADD"},
            {"sku_id": "20941000-0000-0000-0000-000000000000", "action": "REMOVE"}
        ]
    }
    response = client.post("/api/v1/scenarios/recalculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_id"] == scenario_id
    assert "projected_sales" in data
    assert "shelf_utilization_pct" in data

def test_submit_approval_and_confirmation():
    scenario_id = "b0000000-0000-0000-0000-000000000002"
    payload = {
        "scenario_id": scenario_id,
        "applied_changes": [
            {"sku_id": "10482000-0000-0000-0000-000000000000", "action": "ADD"}
        ]
    }
    response = client.post("/api/v1/approval/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audit_id" in data

    audit_id = data["audit_id"]
    response_conf = client.get(f"/api/v1/confirmation/{audit_id}")
    assert response_conf.status_code == 200
    conf_data = response_conf.json()
    assert conf_data["audit_id"] == audit_id
    assert conf_data["submitted_by"] == "John Doe"
    assert conf_data["summary"]["scenario_name"] == "Balanced"

def test_submit_approval_guardrail_violation():
    scenario_id = "b0000000-0000-0000-0000-000000000002"
    payload = {
        "scenario_id": scenario_id,
        "applied_changes": [
            {"sku_id": "10482000-0000-0000-0000-000000000000", "action": "ADD"},
            {"sku_id": "20941000-0000-0000-0000-000000000000", "action": "ADD"},
            {"sku_id": "30291000-0000-0000-0000-000000000000", "action": "ADD"}
        ]
    }
    response = client.post("/api/v1/approval/submit", json=payload)
    assert response.status_code == 400
    assert "Guardrail violation" in response.json()["detail"]
