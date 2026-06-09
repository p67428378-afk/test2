"""
Module: server/tests/test_assortment.py
Purpose: Unit tests for the assortment advisor endpoints.
Author: Backend Developer Agent
Created: 2026-06-09
"""

import pytest
import httpx  # Explicitly imported so auto_fix_missing_dependencies detects it
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db

# Use in-memory SQLite with StaticPool for thread-safe testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def setup_db():
    # Recreate tables before each test to ensure isolation
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_seed_database():
    response = client.post("/api/v1/seed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "seeded successfully" in data["message"]

def test_get_dashboard_default():
    # Even if not seeded, it should return default values
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 1245.50
    assert data["private_brand_percent"] == 15.4
    assert data["in_stock_rate"] == 96.8
    assert data["shelf_capacity_percent"] == 88.2

def test_get_dashboard_seeded():
    # Seed first
    client.post("/api/v1/seed")
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 1245.50
    assert data["private_brand_percent"] == 15.4

def test_get_sku_performance():
    # Seed first
    client.post("/api/v1/seed")
    response = client.get("/api/v1/sku-performance")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["sku"] == "SKU-1001"
    assert data[0]["product_name"] == "Clover Valley Potato Chips 10oz"
    assert data[0]["status_badge"] == "GROW"
    assert data[0]["is_private_brand"] is True

def test_get_scenarios():
    # Seed first
    client.post("/api/v1/seed")
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    names = [s["name"] for s in data]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names

def test_submit_assortment_success():
    # Seed first
    client.post("/api/v1/seed")
    
    # Get scenarios to find a valid ID
    scenarios_response = client.get("/api/v1/scenarios")
    scenarios = scenarios_response.json()
    scenario_id = scenarios[0]["id"]
    
    # Submit
    submit_response = client.post(
        "/api/v1/submit",
        json={"scenario_id": scenario_id, "user_id": "manager_1"}
    )
    assert submit_response.status_code == 200
    data = submit_response.json()
    assert data["status"] == "Submitted"
    assert data["submitted_by"] == "manager_1"
    assert "submission_id" in data
    assert "timestamp" in data

def test_submit_assortment_invalid_scenario():
    # Submit with invalid scenario ID
    submit_response = client.post(
        "/api/v1/submit",
        json={"scenario_id": "invalid-uuid", "user_id": "manager_1"}
    )
    assert submit_response.status_code == 400
    assert "invalid" in submit_response.json()["detail"]
