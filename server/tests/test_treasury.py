import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from server.main import app
from server.database import Base, get_db

# Use a file-based SQLite database for testing to avoid connection-sharing issues
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


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
    # Clear and recreate tables for each test to ensure isolation
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up the test database file after tests
    try:
        if os.path.exists("./test_temp.db"):
            os.remove("./test_temp.db")
    except Exception:
        pass


def test_create_and_get_accounts():
    # Create Hub Account
    response = client.post(
        "/api/v1/accounts",
        json={
            "name": "USD Central Hub",
            "account_number": "HUB-USD-999",
            "currency": "USD",
            "balance": 1000000.0,
            "bank_provider": "JPMorgan Chase",
            "is_hub": True,
        },
    )
    assert response.status_code == 201
    hub_data = response.json()
    assert hub_data["name"] == "USD Central Hub"
    assert hub_data["is_hub"] is True

    # Create Operating Account
    response = client.post(
        "/api/v1/accounts",
        json={
            "name": "EUR Operating",
            "account_number": "OP-EUR-999",
            "currency": "EUR",
            "balance": 500000.0,
            "bank_provider": "Deutsche Bank",
            "is_hub": False,
        },
    )
    assert response.status_code == 201
    op_data = response.json()
    assert op_data["name"] == "EUR Operating"
    assert op_data["is_hub"] is False

    # Get all accounts
    response = client.get("/api/v1/accounts")
    assert response.status_code == 200
    accounts = response.json()
    assert len(accounts) == 2

    # Duplicate account number should fail
    response = client.post(
        "/api/v1/accounts",
        json={
            "name": "EUR Operating Duplicate",
            "account_number": "OP-EUR-999",
            "currency": "EUR",
            "balance": 100000.0,
            "bank_provider": "Deutsche Bank",
            "is_hub": False,
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_sweep_rules_crud():
    # Create accounts first
    hub_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "USD Central Hub",
            "account_number": "HUB-USD-100",
            "currency": "USD",
            "balance": 1000000.0,
            "bank_provider": "JPMorgan Chase",
            "is_hub": True,
        },
    )
    hub_id = hub_res.json()["id"]

    op_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "EUR Operating",
            "account_number": "OP-EUR-100",
            "currency": "EUR",
            "balance": 500000.0,
            "bank_provider": "Deutsche Bank",
            "is_hub": False,
        },
    )
    op_id = op_res.json()["id"]

    # Create Sweep Rule
    rule_res = client.post(
        "/api/v1/sweep-rules",
        json={
            "source_account_id": op_id,
            "hub_account_id": hub_id,
            "target_balance": 100000.0,
            "sweep_threshold": 20000.0,
            "schedule": "0 18 * * 1-5",
            "status": "ACTIVE",
        },
    )
    assert rule_res.status_code == 201
    rule_data = rule_res.json()
    assert rule_data["target_balance"] == 100000.0
    rule_id = rule_data["id"]

    # Get Sweep Rules
    get_res = client.get("/api/v1/sweep-rules")
    assert get_res.status_code == 200
    assert len(get_res.json()) == 1

    # Update Sweep Rule
    update_res = client.put(
        f"/api/v1/sweep-rules/{rule_id}",
        json={"target_balance": 150000.0, "status": "PAUSED"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["target_balance"] == 150000.0
    assert update_res.json()["status"] == "PAUSED"

    # Delete Sweep Rule
    delete_res = client.delete(f"/api/v1/sweep-rules/{rule_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["status"] == "SUCCESS"

    # Get Sweep Rules again
    get_res = client.get("/api/v1/sweep-rules")
    assert len(get_res.json()) == 0


def test_hedge_rules_crud():
    # Create Hedge Rule
    rule_res = client.post(
        "/api/v1/hedge-rules",
        json={
            "currency_pair": "EUR/USD",
            "amount_threshold": 500000.0,
            "volatility_threshold": 1.5,
            "status": "ACTIVE",
        },
    )
    assert rule_res.status_code == 201
    rule_data = rule_res.json()
    assert rule_data["currency_pair"] == "EUR/USD"
    rule_id = rule_data["id"]

    # Get Hedge Rules
    get_res = client.get("/api/v1/hedge-rules")
    assert get_res.status_code == 200
    assert len(get_res.json()) == 1

    # Update Hedge Rule
    update_res = client.put(
        f"/api/v1/hedge-rules/{rule_id}",
        json={"amount_threshold": 600000.0, "status": "PAUSED"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["amount_threshold"] == 600000.0
    assert update_res.json()["status"] == "PAUSED"

    # Delete Hedge Rule
    delete_res = client.delete(f"/api/v1/hedge-rules/{rule_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["status"] == "SUCCESS"


def test_trigger_sweep_and_hedging():
    # Create accounts
    hub_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "USD Central Hub",
            "account_number": "HUB-USD-200",
            "currency": "USD",
            "balance": 1000000.0,
            "bank_provider": "JPMorgan Chase",
            "is_hub": True,
        },
    )
    hub_id = hub_res.json()["id"]

    op_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "EUR Operating",
            "account_number": "OP-EUR-200",
            "currency": "EUR",
            "balance": 500000.0,
            "bank_provider": "Deutsche Bank",
            "is_hub": False,
        },
    )
    op_id = op_res.json()["id"]

    # Create Sweep Rule
    client.post(
        "/api/v1/sweep-rules",
        json={
            "source_account_id": op_id,
            "hub_account_id": hub_id,
            "target_balance": 100000.0,
            "sweep_threshold": 20000.0,
            "schedule": "0 18 * * 1-5",
            "status": "ACTIVE",
        },
    )

    # Create Hedge Rule (threshold 400k USD, swept amount is 400k EUR * 1.085 = 434k USD, so it should trigger)
    client.post(
        "/api/v1/hedge-rules",
        json={
            "currency_pair": "EUR/USD",
            "amount_threshold": 400000.0,
            "volatility_threshold": 1.5,
            "status": "ACTIVE",
        },
    )

    # Trigger Sweep
    trigger_res = client.post("/api/v1/sweeps/trigger", json={})
    assert trigger_res.status_code == 200
    data = trigger_res.json()
    assert data["status"] == "SUCCESS"
    assert data["sweeps_executed"] == 1
    assert data["hedges_triggered"] == 1

    # Verify balances
    # EUR Operating: 500k - 400k swept = 100k
    # USD Central Hub: 1M + 434k (400k * 1.085) = 1,434,000.0
    accounts_res = client.get("/api/v1/accounts")
    accounts = {acc["account_number"]: acc["balance"] for acc in accounts_res.json()}
    assert accounts["OP-EUR-200"] == 100000.0
    assert accounts["HUB-USD-200"] == 1434000.0

    # Verify Activity Logs
    logs_res = client.get("/api/v1/activity-logs")
    assert logs_res.status_code == 200
    logs_data = logs_res.json()
    assert logs_data["total"] == 2  # 1 sweep + 1 hedge
    types = [log["type"] for log in logs_data["logs"]]
    assert "SWEEP" in types
    assert "HEDGE" in types


def test_dashboard_stats_and_charts():
    # Create accounts and trigger a sweep to generate stats
    hub_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "USD Central Hub",
            "account_number": "HUB-USD-300",
            "currency": "USD",
            "balance": 1000000.0,
            "bank_provider": "JPMorgan Chase",
            "is_hub": True,
        },
    )
    hub_id = hub_res.json()["id"]

    op_res = client.post(
        "/api/v1/accounts",
        json={
            "name": "EUR Operating",
            "account_number": "OP-EUR-300",
            "currency": "EUR",
            "balance": 500000.0,
            "bank_provider": "Deutsche Bank",
            "is_hub": False,
        },
    )
    op_id = op_res.json()["id"]

    client.post(
        "/api/v1/sweep-rules",
        json={
            "source_account_id": op_id,
            "hub_account_id": hub_id,
            "target_balance": 100000.0,
            "sweep_threshold": 20000.0,
            "schedule": "0 18 * * 1-5",
            "status": "ACTIVE",
        },
    )

    client.post("/api/v1/sweeps/trigger", json={})

    # Get Dashboard Stats
    stats_res = client.get("/api/v1/dashboard/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["active_rules_count"] == 1
    assert stats["total_swept_usd"] == 434000.0
    assert stats["idle_cash_minimized_usd"] == 434000.0 * 0.984

    # Get Dashboard Charts
    charts_res = client.get("/api/v1/dashboard/charts")
    assert charts_res.status_code == 200
    charts = charts_res.json()
    assert len(charts["currency_distribution"]) > 0
    assert len(charts["trend"]) == 7
