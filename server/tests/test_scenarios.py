import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base, engine, seed_db
from server import models

# Clear any overrides from other tests
app.dependency_overrides.clear()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_db()

def test_get_scenarios():
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    names = [s["name"] for s in data]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names

def test_select_scenario():
    # First get scenarios to find IDs
    response = client.get("/api/v1/scenarios")
    scenarios = response.json()
    
    balanced_id = None
    for s in scenarios:
        if s["name"] == "Balanced":
            balanced_id = s["id"]
            break
            
    assert balanced_id is not None
    
    # Select Balanced scenario
    select_response = client.post("/api/v1/scenarios/select", json={"scenario_id": balanced_id})
    assert select_response.status_code == 200
    data = select_response.json()
    assert data["name"] == "Balanced"
    assert data["projected_sales_change_pct"] == 3.5
    assert len(data["actions"]) > 0
    assert len(data["guardrails"]) > 0
    
    # Test 404 for non-existent scenario
    fake_id = "00000000-0000-0000-0000-000000000000"
    select_response = client.post("/api/v1/scenarios/select", json={"scenario_id": fake_id})
    assert select_response.status_code == 404
