import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Set testing environment variable
os.environ["TESTING"] = "true"

from ..database import Base, get_db
from ..main import app

# Use in-memory SQLite for testing
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


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the DG Cluster Assortment Advisor API"
    }


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_pct" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_pct" in data
    assert data["in_stock_rate"]["status"] == "Healthy"


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["sku_id"] == "SKU-1042"
    assert data[0]["recommendation"] == "GROW"


def test_calculate_scenario_balanced():
    response = client.post(
        "/api/v1/scenarios/calculate", json={"scenario_type": "Balanced"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "Balanced"
    assert data["guardrails"]["capacity_check"]["passed"] is True
    assert data["guardrails"]["private_brand_check"]["passed"] is True
    assert data["guardrails"]["swap_limit_check"]["passed"] is True


def test_calculate_scenario_conservative():
    response = client.post(
        "/api/v1/scenarios/calculate", json={"scenario_type": "Conservative"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "Conservative"
    assert data["guardrails"]["private_brand_check"]["passed"] is False


def test_calculate_scenario_invalid():
    response = client.post(
        "/api/v1/scenarios/calculate", json={"scenario_type": "InvalidType"}
    )
    assert response.status_code == 400


def test_submit_approval_balanced():
    response = client.post("/api/v1/approvals", json={"scenario_type": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_trail_id" in data
    assert data["submitted_by"] == "Category Manager"


def test_submit_approval_failed_guardrails():
    # Conservative fails private brand check, so it should be rejected
    response = client.post("/api/v1/approvals", json={"scenario_type": "Conservative"})
    assert response.status_code == 400
    assert "Guardrail checks fail" in response.json()["detail"]
