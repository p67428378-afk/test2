import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data
    assert data["sales_per_linear_ft"] == 15.75


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["sku"] == "Lay's Classic 13oz"


def test_get_skus_filtered():
    response = client.get("/api/v1/skus?filter_status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    for item in data:
        assert item["status"] == "GROW"


def test_get_skus_sorted():
    response = client.get("/api/v1/skus?sort_by=-sales_per_linear_ft")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["sales_per_linear_ft"] == 22.40  # Clover Valley Potato Chips


def test_get_skus_invalid_params():
    response = client.get("/api/v1/skus?sort_by=invalid_field")
    assert response.status_code == 400
    response = client.get("/api/v1/skus?filter_status=INVALID")
    assert response.status_code == 400


def test_get_scenario():
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert data["projected_sales_impact"] == 4.2
    assert data["guardrails"]["private_brand_goal_met"] is True


def test_get_scenario_not_found():
    response = client.get("/api/v1/scenarios/unknown")
    assert response.status_code == 404


def test_create_and_get_assortment_plan():
    # Create plan
    payload = {"scenario_name": "Balanced", "submitted_by": "manager@dollargeneral.com"}
    response = client.post("/api/v1/assortment-plans", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["scenario_name"] == "Balanced"
    assert data["submitted_by"] == "manager@dollargeneral.com"
    assert "audit_trail_id" in data
    assert data["guardrail_status"]["private_brand_goal_met"] is True
    assert len(data["sku_actions"]) > 0

    plan_id = data["id"]

    # Get plan
    response = client.get(f"/api/v1/assortment-plans/{plan_id}")
    assert response.status_code == 200
    get_data = response.json()
    assert get_data["id"] == plan_id
    assert get_data["scenario_name"] == "Balanced"


def test_create_assortment_plan_invalid_scenario():
    payload = {
        "scenario_name": "InvalidScenario",
        "submitted_by": "manager@dollargeneral.com",
    }
    response = client.post("/api/v1/assortment-plans", json=payload)
    assert response.status_code == 422


def test_get_assortment_plan_not_found():
    response = client.get(
        "/api/v1/assortment-plans/00000000-0000-0000-0000-000000000000"
    )
    assert response.status_code == 404
