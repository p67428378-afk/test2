import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

from server.main import app
from server.database import Base, get_db
from server import models

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_get_kpis():
    response = client.get("/api/v1/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_pct" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_utilized" in data
    assert data["sales_per_linear_ft"] == 145.5
    assert data["private_brand_pct"] == 18.5

def test_get_skus():
    response = client.get("/api/v1/dashboard/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["sku_number"] == "SKU-1001"
    assert data[0]["name"] == "Good & Smart Potato Chips"
    assert data[0]["brand"] == "Private Brand"
    assert data[0]["status"] == "GROW"

def test_get_scenarios():
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    names = [s["name"] for s in data]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names

def test_select_scenario_balanced():
    response = client.post("/api/v1/scenarios/select", json={"scenario_name": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert "guardrails" in data
    assert "projected_kpis" in data
    assert "proposed_changes" in data
    assert "skus" in data
    assert data["guardrails"]["private_brand_check"] is True
    assert data["guardrails"]["shelf_capacity_check"] is True
    assert data["projected_kpis"]["private_brand_pct"] == 21.5
    assert data["proposed_changes"]["add"] == 3

def test_select_scenario_invalid():
    response = client.post("/api/v1/scenarios/select", json={"scenario_name": "SuperAggressive"})
    assert response.status_code == 400
    assert "detail" in response.json()

def test_submit_approval_balanced():
    response = client.post("/api/v1/approval/submit", json={"approved_by": "Sarah Chen", "scenario_name": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert data["approved_by"] == "Sarah Chen"
    assert data["success"] is True
    assert data["summary"]["scenario"] == "Balanced"
    assert data["summary"]["added_skus"] == 3
    assert "transaction_id" in data

def test_submit_approval_invalid():
    response = client.post("/api/v1/approval/submit", json={"approved_by": "Sarah Chen", "scenario_name": "Unknown"})
    assert response.status_code == 400
    assert "detail" in response.json()
