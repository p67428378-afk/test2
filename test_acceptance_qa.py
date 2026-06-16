import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_get_kpis(client):
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data

def test_get_scenario_balanced(client):
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"].lower() == "balanced"
    assert "sales_per_linear_ft" in data["projected_impact"]
    assert "private_brand_percentage" in data["projected_impact"]
    assert len(data["sku_actions"]) > 0
    assert "private_brand_ok" in data["guardrail_status"]

def test_get_scenario_conservative(client):
    response = client.get("/api/v1/scenarios/conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"].lower() == "conservative"
    assert "sales_per_linear_ft" in data["projected_impact"]
    assert "private_brand_percentage" in data["projected_impact"]
    assert "private_brand_ok" in data["guardrail_status"]

def test_get_scenario_aggressive(client):
    response = client.get("/api/v1/scenarios/aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario"].lower() == "aggressive"
    assert "sales_per_linear_ft" in data["projected_impact"]
    assert "private_brand_percentage" in data["projected_impact"]
    assert "private_brand_ok" in data["guardrail_status"]

def test_get_scenario_invalid(client):
    response = client.get("/api/v1/scenarios/invalid_scenario")
    assert response.status_code in [400, 422]

def test_submit_decision_success(client):
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
    assert "message" in data
    assert "audit_trail_id" in data

def test_submit_decision_invalid_scenario(client):
    payload = {
        "scenario": "invalid_scenario",
        "actions": [
            {"sku_name": "Lay's Classic Potato Chips 13oz", "action": "MAINTAIN"}
        ]
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code in [400, 422]