import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.database import Base
from server.app import database
from server.app.models import Product, AssortmentPlan, AssortmentPlanAction
from server.app.main import app
import os

# Use SQLite in-memory with StaticPool for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[database.get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed initial products
    db = TestingSessionLocal()
    from server.app.crud import seed_products
    seed_products(db)
    db.close()
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate" in data
    assert "private_brand_pct" in data
    assert "sales_per_linear_ft" in data
    assert "sales_trend_pct" in data
    assert "shelf_capacity_pct" in data

def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["sku"] == "SKU-1001"

def test_get_scenarios():
    # Test balanced scenario
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "balanced"
    assert data["projected_sales"] == 135000.0
    assert data["guardrails"]["private_brand_passed"] is True

    # Test conservative scenario
    response = client.get("/api/v1/scenarios/conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "conservative"

    # Test aggressive scenario
    response = client.get("/api/v1/scenarios/aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "aggressive"
    assert data["guardrails"]["private_brand_passed"] is False

    # Test invalid scenario
    response = client.get("/api/v1/scenarios/invalid")
    assert response.status_code == 400

def test_create_assortment_plan():
    payload = {
        "scenario_name": "balanced",
        "submitted_by": "John Doe",
        "projected_sales": 135000.0,
        "projected_private_brand_pct": 26.5,
        "sku_action_list": [
            {"sku": "SKU-1001", "action": "KEEP"},
            {"sku": "SKU-1004", "action": "SWAP"}
        ]
    }
    response = client.post("/api/v1/assortment-plans", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "audit_trail_id" in data
    assert data["scenario_name"] == "balanced"
    assert data["submitted_by"] == "John Doe"
    assert "maintained" in data["summary"]
