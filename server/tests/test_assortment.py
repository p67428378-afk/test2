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

def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data
    assert data["sales_per_linear_ft"] == 125.50
    assert data["private_brand_percentage"] == 22.5

def test_get_scenario_balanced():
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"] == "balanced"
    assert data["projected_impact"]["sales_per_linear_ft"] == 125.50
    assert data["projected_impact"]["private_brand_percentage"] == 22.5
    assert len(data["sku_actions"]) == 6
    assert data["guardrail_status"]["private_brand_ok"] is True

def test_get_scenario_conservative():
    response = client.get("/api/v1/scenarios/conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"] == "conservative"
    assert data["projected_impact"]["sales_per_linear_ft"] == 118.00
    assert data["projected_impact"]["private_brand_percentage"] == 21.0
    assert data["guardrail_status"]["private_brand_ok"] is True

def test_get_scenario_aggressive():
    response = client.get("/api/v1/scenarios/aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"] == "aggressive"
    assert data["projected_impact"]["sales_per_linear_ft"] == 135.00
    assert data["projected_impact"]["private_brand_percentage"] == 25.0
    assert data["guardrail_status"]["private_brand_ok"] is True

def test_get_scenario_invalid():
    response = client.get("/api/v1/scenarios/invalid_scenario")
    assert response.status_code == 400
    assert "Invalid scenario name" in response.json()["detail"]

def test_submit_decision_success():
    payload = {
        "scenario": "balanced",
        "actions": [
            {"sku_name": "Lay's Classic Potato Chips 13oz", "action": "MAINTAIN"},
            {"sku_name": "Clover Valley Tortilla Chips 10oz", "action": "GROW"}
        ]
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Assortment decision submitted successfully."
    assert "audit_trail_id" in data

def test_submit_decision_invalid_scenario():
    payload = {
        "scenario": "invalid_scenario",
        "actions": [
            {"sku_name": "Lay's Classic Potato Chips 13oz", "action": "MAINTAIN"}
        ]
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 422
