"""
Module: server/tests/test_sweeping.py
Purpose: Unit and integration tests for Global Treasury Sweeping Rule Management
"""

import pytest
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


@pytest.fixture(autouse=True)
def setup_db():
    # Re-create tables before each test to ensure isolation
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


def test_create_and_list_rules():
    # AC: Web Platform: Rule Creation and Management
    # First, list rules to trigger default user and account seeding
    response = client.get("/api/v1/rules")
    assert response.status_code == 200

    # Create a new sweeping rule
    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    response = client.post("/api/v1/rules", json=rule_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "CAD to USD Daily Sweep"
    assert data["status"] == "PENDING_APPROVAL"

    # List rules again and verify the created rule is present
    response = client.get("/api/v1/rules")
    assert response.status_code == 200
    rules = response.json()
    assert len(rules) == 1
    assert rules[0]["name"] == "CAD to USD Daily Sweep"


def test_update_rule():
    # AC: Web Platform: Rule Creation and Management
    # Seed default user and accounts
    client.get("/api/v1/rules")

    # Create rule
    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Update rule
    update_data = {
        "name": "CAD to USD Weekly Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 120000.0,
        "frequency": "Weekly",
        "fx_strategy": "forward",
    }
    response = client.put(f"/api/v1/rules/{rule_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "CAD to USD Weekly Sweep"
    assert data["threshold"] == 120000.0
    assert data["frequency"] == "Weekly"
    assert data["fx_strategy"] == "forward"


def test_workflow_details_and_pause():
    # AC: Mobile App: Workflow Intervention
    client.get("/api/v1/rules")

    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Get workflow details
    response = client.get(f"/api/v1/workflows/{rule_id}")
    assert response.status_code == 200
    details = response.json()
    assert details["rule_id"] == rule_id
    assert details["amount"] == 50000.0  # 150,000 balance - 100,000 threshold
    assert details["fx_rate"] == 0.74
    assert details["local_limit_compliant"] is True
    assert details["rate_lock_seconds"] == 120

    # Pause workflow
    response = client.post(f"/api/v1/workflows/{rule_id}/pause")
    assert response.status_code == 200
    assert response.json()["status"] == "PAUSED"


def test_workflow_approve_and_execute():
    # AC: Backend Process: Automated Execution
    client.get("/api/v1/rules")

    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Approve workflow
    response = client.post(f"/api/v1/workflows/{rule_id}/approve")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "APPROVED"
    assert "execution_id" in data


def test_workflow_reject():
    # AC: Mobile App: Workflow Intervention
    client.get("/api/v1/rules")

    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Reject workflow
    response = client.post(f"/api/v1/workflows/{rule_id}/reject")
    assert response.status_code == 200
    assert response.json()["status"] == "REJECTED"


def test_workflow_adjust():
    # AC: Mobile App: Workflow Intervention
    client.get("/api/v1/rules")

    rule_data = {
        "name": "CAD to USD Daily Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Adjust parameters
    adjust_data = {"fx_strategy": "forward", "threshold": 110000.0}
    response = client.post(f"/api/v1/workflows/{rule_id}/adjust", json=adjust_data)
    assert response.status_code == 200
    data = response.json()
    assert data["fx_strategy"] == "forward"
    assert data["threshold"] == 110000.0


def test_local_capital_limit_breach():
    # AC: Backend Process: Automated Execution (Local Capital Limits)
    client.get("/api/v1/rules")

    # Create a rule with a very low threshold, which would sweep almost all balance,
    # leaving less than the minimum required balance of $20,000.
    rule_data = {
        "name": "CAD to USD Aggressive Sweep",
        "source_accounts": ["CAD-SUB-001"],
        "target_account": "USD-CENTRAL-001",
        "threshold": 5000.0,  # This would sweep 145,000, leaving only 5,000 (breaching 20,000 limit)
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Get workflow details and verify local_limit_compliant is False
    response = client.get(f"/api/v1/workflows/{rule_id}")
    assert response.status_code == 200
    assert response.json()["local_limit_compliant"] is False

    # Try to approve and verify it fails with 400
    response = client.post(f"/api/v1/workflows/{rule_id}/approve")
    assert response.status_code == 400
    assert "local capital limit breached" in response.json()["detail"]


def test_aml_flagging():
    # AC: Backend Process: Automated Execution (AML Flagging)
    client.get("/api/v1/rules")

    # Create a rule involving a high-risk jurisdiction (Russia) with a sweep amount > $10,000
    rule_data = {
        "name": "High Risk Sweep",
        "source_accounts": ["HIGH-RISK-SUB-001"],  # Russia, balance 120,000
        "target_account": "USD-CENTRAL-001",
        "threshold": 100000.0,  # Sweep amount = 20,000 (> 10,000)
        "frequency": "Daily",
        "fx_strategy": "spot",
    }
    create_resp = client.post("/api/v1/rules", json=rule_data)
    rule_id = create_resp.json()["id"]

    # Approve and verify it gets flagged for AML
    response = client.post(f"/api/v1/workflows/{rule_id}/approve")
    assert response.status_code == 200
    assert response.json()["status"] == "FLAGGED_FOR_AML"
