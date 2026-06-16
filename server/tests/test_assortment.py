import pytest
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

@pytest.fixture(autouse=True)
def clean_db():
    # Clear tables before each test to ensure clean state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_get_kpis():
    response = client.get("/api/v1/assortment/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert data["sales_per_linear_ft"]["value"] == 15.75
    assert data["private_brand_percentage"]["value"] == 18.5
    assert data["in_stock_rate"]["value"] == 94.2
    assert data["shelf_capacity"]["value"] == 82.0

def test_get_skus():
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 6
    assert data[0]["sku"] == "SKU-1001"

def test_get_skus_filter_status():
    response = client.get("/api/v1/assortment/skus?status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    for item in data:
        assert item["status"] == "GROW"

def test_get_skus_sort():
    response = client.get("/api/v1/assortment/skus?sort_by=sales&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 6
    # Check that sales are sorted in descending order
    sales = [item["sales"] for item in data]
    assert sales == sorted(sales, reverse=True)

def test_get_scenarios():
    response = client.get("/api/v1/assortment/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    names = [s["name"] for s in data]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names

def test_submit_scenario_success():
    # First get scenarios to find the Balanced scenario ID
    scenarios_resp = client.get("/api/v1/assortment/scenarios")
    scenarios = scenarios_resp.json()
    balanced = next(s for s in scenarios if s["name"] == "Balanced")

    # Submit Balanced scenario (no guardrail violations)
    submit_resp = client.post(
        "/api/v1/assortment/submit",
        json={
            "scenario_id": balanced["id"],
            "submitted_by": "Marcus Vance",
            "acknowledge_violations": False
        }
    )
    assert submit_resp.status_code == 200
    submit_data = submit_resp.json()
    assert submit_data["scenario_name"] == "Balanced"
    assert submit_data["submitted_by"] == "Marcus Vance"
    assert submit_data["status"] == "APPROVED"
    assert "audit_id" in submit_data

def test_submit_scenario_guardrail_violation_fails():
    # First get scenarios to find the Aggressive scenario ID
    scenarios_resp = client.get("/api/v1/assortment/scenarios")
    scenarios = scenarios_resp.json()
    aggressive = next(s for s in scenarios if s["name"] == "Aggressive")

    # Submit Aggressive scenario (has guardrail violations) without acknowledgment
    submit_resp = client.post(
        "/api/v1/assortment/submit",
        json={
            "scenario_id": aggressive["id"],
            "submitted_by": "Marcus Vance",
            "acknowledge_violations": False
        }
    )
    assert submit_resp.status_code == 422
    assert "violations" in submit_resp.json()["detail"]

def test_submit_scenario_guardrail_violation_acknowledged_succeeds():
    # First get scenarios to find the Aggressive scenario ID
    scenarios_resp = client.get("/api/v1/assortment/scenarios")
    scenarios = scenarios_resp.json()
    aggressive = next(s for s in scenarios if s["name"] == "Aggressive")

    # Submit Aggressive scenario with acknowledgment
    submit_resp = client.post(
        "/api/v1/assortment/submit",
        json={
            "scenario_id": aggressive["id"],
            "submitted_by": "Marcus Vance",
            "acknowledge_violations": True
        }
    )
    assert submit_resp.status_code == 200
    submit_data = submit_resp.json()
    assert submit_data["scenario_name"] == "Aggressive"
    assert submit_data["status"] == "PENDING_ACKNOWLEDGED"

def test_submit_scenario_invalid_id():
    submit_resp = client.post(
        "/api/v1/assortment/submit",
        json={
            "scenario_id": "invalid-id",
            "submitted_by": "Marcus Vance",
            "acknowledge_violations": False
        }
    )
    assert submit_resp.status_code == 400
    assert "invalid or missing" in submit_resp.json()["detail"]
