import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    db = TestingSessionLocal()
    try:
        # Clear existing data to avoid unique constraint violations
        db.query(models.Product).delete()
        db.query(models.KPI).delete()
        db.query(models.AssortmentScenario).delete()
        db.query(models.AssortmentPlanAudit).delete()
        db.commit()

        # Seed products
        products = [
            models.Product(sku_name="Lay's Classic 8oz", sales_velocity=145.0, margin_pct=32.0, current_inventory=450),
            models.Product(sku_name="Clover Valley Potato Chips 10oz", sales_velocity=98.0, margin_pct=42.0, current_inventory=310),
            models.Product(sku_name="Doritos Nacho Cheese 9.75oz", sales_velocity=120.0, margin_pct=28.0, current_inventory=180),
            models.Product(sku_name="Cheetos Crunchy 8.5oz", sales_velocity=85.0, margin_pct=29.0, current_inventory=120),
            models.Product(sku_name="Generic Pretzels 12oz", sales_velocity=22.0, margin_pct=15.0, current_inventory=85),
            models.Product(sku_name="Underperforming Corn Chips 6oz", sales_velocity=15.0, margin_pct=18.0, current_inventory=40),
        ]
        db.add_all(products)

        # Seed KPIs
        kpis = [
            models.KPI(scenario_name="Conservative", sales_per_linear_ft=12.5, private_brand_pct=18.0, in_stock_rate=96.0, shelf_capacity=75.0),
            models.KPI(scenario_name="Balanced", sales_per_linear_ft=15.75, private_brand_pct=22.0, in_stock_rate=94.0, shelf_capacity=85.0),
            models.KPI(scenario_name="Aggressive", sales_per_linear_ft=18.2, private_brand_pct=15.0, in_stock_rate=91.0, shelf_capacity=92.0),
        ]
        db.add_all(kpis)

        # Seed scenarios
        scenarios = [
            models.AssortmentScenario(name="Conservative", sales_lift=1.2, pb_change=0.5, description="Conservative scenario focusing on low-risk adjustments."),
            models.AssortmentScenario(name="Balanced", sales_lift=3.5, pb_change=2.1, description="Balanced scenario optimizing sales and private brand goals."),
            models.AssortmentScenario(name="Aggressive", sales_lift=6.8, pb_change=-1.5, description="Aggressive scenario maximizing sales lift with higher risk."),
        ]
        db.add_all(scenarios)
        db.commit()
    finally:
        db.close()

def test_get_kpis_success():
    response = client.get("/api/v1/kpis?scenario=Balanced")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate" in data
    assert "private_brand_pct" in data
    assert "sales_per_linear_ft" in data
    assert "shelf_capacity" in data
    assert data["private_brand_pct"] == 22.0

def test_get_kpis_invalid_scenario():
    response = client.get("/api/v1/kpis?scenario=InvalidScenario")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario name provided"

def test_get_skus_success():
    response = client.get("/api/v1/skus?scenario=Balanced&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) <= 5
    assert data["total"] >= 6

    # Verify status calculation for Lay's Classic 8oz
    lays = next((item for item in data["items"] if item["sku_name"] == "Lay's Classic 8oz"), None)
    if lays:
        assert lays["status"] == "GROW"

def test_get_skus_search():
    response = client.get("/api/v1/skus?scenario=Balanced&search=Lay")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["sku_name"] == "Lay's Classic 8oz"

def test_get_skus_sorting():
    response = client.get("/api/v1/skus?scenario=Balanced&sort_by=sales_velocity&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 2
    assert data["items"][0]["sales_velocity"] >= data["items"][1]["sales_velocity"]

def test_get_scenarios():
    response = client.get("/api/v1/scenarios?scenario=Balanced")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    balanced = next((s for s in data if s["name"] == "Balanced"), None)
    assert balanced is not None
    assert balanced["is_selected"] is True

def test_submit_success():
    # Get a valid SKU ID
    skus_response = client.get("/api/v1/skus?scenario=Balanced")
    sku_id = skus_response.json()["items"][0]["id"]

    payload = {
        "scenario_name": "Balanced",
        "sku_actions": [
            {"sku_id": sku_id, "action": "GROW"}
        ]
    }
    response = client.post("/api/v1/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "tracking_id" in data
    assert data["submitted_by"] == "Category Manager"

def test_submit_guardrail_fail():
    # Get a valid SKU ID
    skus_response = client.get("/api/v1/skus?scenario=Balanced")
    sku_id = skus_response.json()["items"][0]["id"]

    payload = {
        "scenario_name": "Aggressive",
        "sku_actions": [
            {"sku_id": sku_id, "action": "GROW"}
        ]
    }
    response = client.post("/api/v1/submit", json=payload)
    assert response.status_code == 400
    assert "Guardrail checks fail" in response.json()["detail"]
