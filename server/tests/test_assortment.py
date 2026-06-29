from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_assortment.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate" in data
    assert "private_brand_percentage" in data
    assert "sales_per_linear_ft" in data
    assert "shelf_capacity" in data
    assert data["in_stock_rate"] == 96.2
    assert data["private_brand_percentage"] == 22.5


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 42

    # Test search
    response_search = client.get("/api/v1/skus?search=Chipz")
    assert response_search.status_code == 200
    data_search = response_search.json()
    assert len(data_search) == 1
    assert data_search[0]["product_name"] == "Chipz Salt & Vinegar 8oz"

    # Test sorting
    response_sort = client.get("/api/v1/skus?sort_by=sales_revenue&sort_order=desc")
    assert response_sort.status_code == 200
    data_sort = response_sort.json()
    assert data_sort[0]["sales_revenue"] >= data_sort[-1]["sales_revenue"]


def test_get_scenarios():
    # Test Balanced
    response = client.get("/api/v1/scenarios/Balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert "projected_metrics" in data
    assert "guardrail_checks" in data
    assert "sku_action_summary" in data
    assert len(data["sku_actions"]) == 42

    # Test Conservative
    response_cons = client.get("/api/v1/scenarios/Conservative")
    assert response_cons.status_code == 200
    assert response_cons.json()["scenario_name"] == "Conservative"

    # Test Aggressive
    response_agg = client.get("/api/v1/scenarios/Aggressive")
    assert response_agg.status_code == 200
    assert response_agg.json()["scenario_name"] == "Aggressive"

    # Test Invalid
    response_invalid = client.get("/api/v1/scenarios/InvalidScenario")
    assert response_invalid.status_code == 400


def test_submit_approval():
    response = client.post(
        "/api/v1/approvals",
        json={"scenario_name": "Balanced", "submitted_by": "Category Manager"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["scenario_name"] == "Balanced"
    assert data["submitted_by"] == "Category Manager"
    assert "audit_trail_id" in data
    assert "submission_timestamp" in data
    assert data["actions_count"] == 42

    # Test Invalid Scenario
    response_invalid = client.post(
        "/api/v1/approvals",
        json={"scenario_name": "InvalidScenario", "submitted_by": "Category Manager"},
    )
    assert response_invalid.status_code == 400
