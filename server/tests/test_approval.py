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

def test_submit_approval():
    # Get scenarios
    response = client.get("/api/v1/scenarios")
    scenarios = response.json()
    
    balanced_id = None
    conservative_id = None
    for s in scenarios:
        if s["name"] == "Balanced":
            balanced_id = s["id"]
        elif s["name"] == "Conservative":
            conservative_id = s["id"]
            
    assert balanced_id is not None
    assert conservative_id is not None
    
    # Submit Conservative (should fail with 400)
    submit_response = client.post("/api/v1/approval/submit", json={"scenario_id": conservative_id})
    assert submit_response.status_code == 400
    assert submit_response.json()["detail"] == "Guardrails not met"
    
    # Submit Balanced (should succeed)
    submit_response = client.post("/api/v1/approval/submit", json={"scenario_id": balanced_id})
    assert submit_response.status_code == 200
    data = submit_response.json()
    assert data["success"] is True
    assert "audit_trail_id" in data
    assert "transaction_id" in data
    assert "timestamp" in data
    assert data["user_email"] == "manager@dollargeneral.com"
