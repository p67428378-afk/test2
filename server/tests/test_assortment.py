import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_assortment.db"

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

def test_get_assortment_dashboard():
    response = client.get("/api/v1/assortment-advisor/snacks")
    assert response.status_code == 200
    data = response.json()
    
    # Check KPIs
    assert "kpis" in data
    assert data["kpis"]["sales_per_linear_ft"] == 425.50
    assert data["kpis"]["private_brand_pct"] == 24.5
    assert data["kpis"]["in_stock_rate"] == 96.8
    assert data["kpis"]["shelf_capacity"] == 92.0

    # Check SKUs
    assert "skus" in data
    assert len(data["skus"]) == 6
    sku_names = [sku["name"] for sku in data["skus"]]
    assert "Lay's Classic 8oz" in sku_names
    assert "Clover Valley Potato Chips 8oz" in sku_names

    # Check Scenarios
    assert "scenarios" in data
    assert "Conservative" in data["scenarios"]
    assert "Balanced" in data["scenarios"]
    assert "Aggressive" in data["scenarios"]
    
    assert data["scenarios"]["Balanced"]["projected_sales_lift"] == 3.8
    assert len(data["scenarios"]["Balanced"]["sku_actions"]) == 6

def test_submit_assortment_review_success():
    # First get the dashboard to seed and get SKU IDs
    get_response = client.get("/api/v1/assortment-advisor/snacks")
    assert get_response.status_code == 200
    dashboard_data = get_response.json()
    
    sku_actions = dashboard_data["scenarios"]["Balanced"]["sku_actions"]
    
    # Submit review
    response = client.post(
        "/api/v1/assortment-advisor/review",
        json={
            "scenario_name": "Balanced",
            "actions": sku_actions
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audit_id" in data
    assert "timestamp" in data

def test_submit_assortment_review_invalid_scenario():
    response = client.post(
        "/api/v1/assortment-advisor/review",
        json={
            "scenario_name": "SuperAggressive",
            "actions": [{"sku_id": "some-uuid", "action": "GROW"}]
        }
    )
    assert response.status_code == 400
    assert "Invalid scenario name" in response.json()["detail"]

def test_submit_assortment_review_empty_actions():
    response = client.post(
        "/api/v1/assortment-advisor/review",
        json={
            "scenario_name": "Balanced",
            "actions": []
        }
    )
    assert response.status_code == 400
    assert "Actions list cannot be empty" in response.json()["detail"]
