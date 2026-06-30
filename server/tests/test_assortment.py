import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.main import app
from server.database import Base, get_db
from server.seed import seed_data

# Setup test database
DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

test_engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        seed_data(db)
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_get_kpis(client):
    # AC: KPI Header Strip: Display Sales per Linear Ft, Private Brand %, In-Stock Rate, and Shelf Capacity.
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_pct" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_pct" in data
    assert data["private_brand_pct"] > 0.0


def test_get_scenario_balanced(client):
    # AC: Scenario Selector: Three side-by-side selectable cards (Conservative, Balanced, Aggressive) with projected impact metrics. Balanced is pre-selected.
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "balanced"
    assert data["projected_sales_impact_pct"] == 4.2
    assert data["projected_private_brand_pct"] == 23.5
    assert data["projected_shelf_capacity_pct"] == 91.0
    assert "action_counts" in data
    assert "guardrails" in data
    assert len(data["skus"]) > 0
    assert data["guardrails"]["new_items_passed"] is True


def test_get_scenario_conservative(client):
    # AC: Scenario Selector: Three side-by-side selectable cards (Conservative, Balanced, Aggressive) with projected impact metrics.
    response = client.get("/api/v1/scenarios/conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "conservative"
    assert data["projected_sales_impact_pct"] == 1.5
    assert data["projected_private_brand_pct"] == 21.0
    assert data["projected_shelf_capacity_pct"] == 85.0


def test_get_scenario_aggressive(client):
    # AC: Scenario Selector: Three side-by-side selectable cards (Conservative, Balanced, Aggressive) with projected impact metrics.
    response = client.get("/api/v1/scenarios/aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "aggressive"
    assert data["projected_sales_impact_pct"] == 6.8
    assert data["projected_private_brand_pct"] == 28.2
    assert data["projected_shelf_capacity_pct"] == 96.5


def test_get_scenario_invalid(client):
    # AC: Scenario Selector: Invalid scenario name returns 404.
    response = client.get("/api/v1/scenarios/invalid_scenario")
    assert response.status_code == 404
    assert "invalid" in response.json()["detail"]


def test_get_scenario_sorting_and_filtering(client):
    # AC: SKU Performance Table: Sortable and filterable.
    # Test search
    response = client.get("/api/v1/scenarios/balanced?search=Potato")
    assert response.status_code == 200
    data = response.json()
    for sku in data["skus"]:
        assert "potato" in sku["sku_name"].lower()

    # Test status filter
    response = client.get("/api/v1/scenarios/balanced?status_filter=GROW")
    assert response.status_code == 200
    data = response.json()
    for sku in data["skus"]:
        assert sku["status"] == "GROW"

    # Test sorting by weekly_sales desc
    response = client.get(
        "/api/v1/scenarios/balanced?sort_by=weekly_sales&sort_order=desc"
    )
    assert response.status_code == 200
    data = response.json()
    sales = [sku["weekly_sales"] for sku in data["skus"]]
    assert sales == sorted(sales, reverse=True)


def test_post_assortment_decision_success(client):
    # AC: Inline Confirmation: Success confirmation banner or modal showing unique Confirmation ID, timestamp, user, scenario applied, and summary of changes.
    payload = {
        "scenario_applied": "balanced",
        "user_name": "Sarah Chen",
        "action_counts": {"grow": 1, "maintain": 17, "reduce": 1, "swap": 1},
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "confirmation_id" in data
    assert data["scenario_applied"] == "balanced"
    assert data["user"] == "Sarah Chen"
    assert "timestamp" in data
    assert data["summary_of_changes"] == {"added": 1, "removed": 1, "swapped": 1}


def test_post_assortment_decision_guardrail_fail(client):
    # AC: Approval Review Panel: Submit button (disabled if guardrails fail).
    # Aggressive scenario has projected_shelf_capacity_pct = 96.5, which is >= 95.0, so guardrails fail.
    payload = {
        "scenario_applied": "aggressive",
        "user_name": "Sarah Chen",
        "action_counts": {"grow": 8, "maintain": 10, "reduce": 1, "swap": 5},
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 400
    assert "Guardrail check fails" in response.json()["detail"]
