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
    response = client.get("/api/v1/assortment/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data
    assert data["private_brand_percentage"] > 0.0


def test_get_skus(client):
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "sku_name" in data[0]
    assert "linear_shelf_footprint" in data[0]


def test_apply_scenario_balanced(client):
    response = client.post("/api/v1/assortment/scenario", json={"scenario": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "status" in data[0]


def test_apply_scenario_invalid(client):
    response = client.post("/api/v1/assortment/scenario", json={"scenario": "Invalid"})
    assert response.status_code == 400


def test_get_sku_mappings(client):
    response = client.get("/api/v1/assortment/sku-mappings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "private_sku_upc" in data[0]
    assert "national_benchmark_upc" in data[0]


def test_submit_changes_success(client):
    payload = {
        "scenario_applied": "Balanced",
        "changes": [
            {"upc": "012200001234", "action": "GROW"},
            {"upc": "028400091561", "action": "MAINTAIN"},
        ],
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "confirmation_id" in data
    assert data["scenario_applied"] == "Balanced"
    assert data["user"] == "current_user"
    assert "timestamp" in data
    assert data["summary"] == {"added": 1, "removed": 0, "swapped": 0}


def test_submit_changes_guardrail_fail(client):
    # Aggressive scenario has projected_shelf_capacity_pct = 96.5, which is >= 95.0, so guardrails fail.
    payload = {
        "scenario_applied": "Aggressive",
        "changes": [
            {"upc": "012200001234", "action": "GROW"},
        ],
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 400
    assert "Guardrail check fails" in response.json()["detail"]
