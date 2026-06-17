from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid

from server.main import app
from server.database import Base, get_db
from server import crud

# Use in-memory SQLite with StaticPool for thread-safe testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables and seed data for testing
Base.metadata.create_all(bind=engine)
db = TestingSessionLocal()
crud.seed_data(db)
db.close()


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_get_kpis():
    # AC: A high-level summary of the cluster's health must be visible at all times at the top of the dashboard.
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "business_per_branch" in data
    assert "capacity_utilization" in data
    assert "casa_ratio" in data
    assert "product_availability" in data
    assert data["business_per_branch"] == 150.0
    assert data["capacity_utilization"] == 85.0
    assert data["casa_ratio"] == 42.0
    assert data["product_availability"] == 99.8


def test_get_products():
    # AC: A detailed table must display all relevant retail products and their core performance metrics, allowing for quick assessment.
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Verify fields of the first product
    product = data[0]
    assert "id" in product
    assert "name" in product
    assert "category" in product
    assert "aum_contribution" in product
    assert "npa_percentage" in product
    assert "status" in product


def test_get_scenarios():
    # AC: The user must be able to simulate the impact of different strategic approaches on key metrics. The "Balanced" scenario should be selected by default.
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    names = [s["name"] for s in data]
    assert "Conservative" in names
    assert "Balanced" in names
    assert "Aggressive" in names


def test_create_approval_request_success():
    # AC: This section summarizes the outcome of the selected scenario and provides a mechanism for submitting decisions, including mandatory compliance checks.
    # AC: Upon successful submission, the user must receive immediate feedback confirming the action and providing a summary for regulatory traceability.
    # Balanced scenario ID: 22222222-2222-2222-2222-222222222222
    payload = {
        "scenario_id": "22222222-2222-2222-2222-222222222222",
        "user_id": "user-123",
        "user_name": "Sarah Chen",
    }
    response = client.post("/api/v1/approval-requests", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["scenario_id"] == "22222222-2222-2222-2222-222222222222"
    assert data["user_id"] == "user-123"
    assert data["status"] == "APPROVED"
    assert "submission_timestamp" in data
    assert "audit_trail" in data

    audit = data["audit_trail"]
    assert audit["approved_by"] == "Sarah Chen"
    assert "guardrails_passed" in audit
    assert len(audit["guardrails_passed"]) == 4
    assert "kyc_aml_flags" in audit["guardrails_passed"]
    assert "minimum_casa_floor" in audit["guardrails_passed"]


def test_create_approval_request_failure():
    # AC: This section summarizes the outcome of the selected scenario and provides a mechanism for submitting decisions, including mandatory compliance checks.
    # Aggressive scenario ID: 33333333-3333-3333-3333-333333333333 (fails minimum CASA floor)
    payload = {
        "scenario_id": "33333333-3333-3333-3333-333333333333",
        "user_id": "user-123",
        "user_name": "Sarah Chen",
    }
    response = client.post("/api/v1/approval-requests", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Guardrail checks failed" in data["detail"]


def test_create_approval_request_not_found():
    # AC: This section summarizes the outcome of the selected scenario and provides a mechanism for submitting decisions, including mandatory compliance checks.
    random_id = str(uuid.uuid4())
    payload = {
        "scenario_id": random_id,
        "user_id": "user-123",
        "user_name": "Sarah Chen",
    }
    response = client.post("/api/v1/approval-requests", json=payload)
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Scenario not found"
