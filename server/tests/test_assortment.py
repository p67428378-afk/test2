import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import os

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_temp.db"):
        os.remove("./test_temp.db")

client = TestClient(app)

def test_get_dashboard_data():
    response = client.get("/api/v1/dashboard-data")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "skus" in data
    assert data["kpis"]["sales_per_linear_ft"]["value"] == 1250.5
    assert len(data["skus"]) == 4
    assert data["skus"][0]["sku_id"] == "sku-001"

def test_get_scenario_balanced():
    response = client.get("/api/v1/scenario/Balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert "projected_metrics" in data
    assert "actions" in data
    assert "guardrails" in data
    assert len(data["actions"]) == 4
    assert data["guardrails"][0]["status"] == "PASSED"

def test_get_scenario_invalid():
    response = client.get("/api/v1/scenario/InvalidScenario")
    assert response.status_code == 404

def test_submit_assortment_success():
    payload = {
        "scenario_name": "Balanced",
        "actions": [
            {"sku_id": "sku-001", "action_type": "GROW"},
            {"sku_id": "sku-002", "action_type": "REDUCE"}
        ]
    }
    response = client.post("/api/v1/submit-assortment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audit_trail" in data
    assert data["audit_trail"]["scenario_name"] == "Balanced"
    assert "submission_id" in data["audit_trail"]

def test_submit_assortment_invalid_scenario():
    payload = {
        "scenario_name": "InvalidScenario",
        "actions": [
            {"sku_id": "sku-001", "action_type": "GROW"}
        ]
    }
    response = client.post("/api/v1/submit-assortment", json=payload)
    assert response.status_code == 400

def test_submit_assortment_invalid_sku():
    payload = {
        "scenario_name": "Balanced",
        "actions": [
            {"sku_id": "sku-invalid", "action_type": "GROW"}
        ]
    }
    response = client.post("/api/v1/submit-assortment", json=payload)
    assert response.status_code == 400
