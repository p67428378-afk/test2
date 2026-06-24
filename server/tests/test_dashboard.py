import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import crud

DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        crud.seed_initial_data(db)
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


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


def test_get_dashboard_kpis(client):
    # AC: A prominent header strip at the top of the dashboard shall display the following real-time Key Performance Indicators (KPIs) for the entire cluster.
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    kpis = data["kpis"]
    assert kpis["business_per_branch"] == "₹42.5 Cr"
    assert kpis["casa_ratio"] == 38.4
    assert kpis["availability_rate"] == 99.85
    assert kpis["capacity_utilization"] == 78.2


def test_get_dashboard_products(client):
    # AC: A comprehensive table view of all retail products, including savings variants, RDs, FDs, personal/gold loans, and insurance cross-sell products.
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    products = data["products"]
    assert len(products) >= 7

    # Verify specific product details
    savings_max = next(p for p in products if p["name"] == "Savings Max")
    assert savings_max["category"] == "Savings"
    assert savings_max["aum_contribution"] == 120.0
    assert savings_max["npa_percentage"] is None
    assert savings_max["status"] == "MAINTAIN"

    gold_loan = next(p for p in products if p["name"] == "Gold Loan")
    assert gold_loan["category"] == "Agri-backed"
    assert gold_loan["aum_contribution"] == 95.0
    assert gold_loan["npa_percentage"] == 1.1
    assert gold_loan["status"] == "GROW"


def test_get_dashboard_scenarios(client):
    # AC: Three selectable cards representing different strategic scenarios for the product mix.
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "scenarios" in data
    scenarios = data["scenarios"]
    assert len(scenarios) == 3

    # Verify Balanced scenario
    balanced = next(s for s in scenarios if s["id"] == "balanced")
    assert balanced["name"] == "Balanced"
    assert balanced["casa_growth"] == 3.2
    assert balanced["npa_risk"] == "Medium"
    assert balanced["roa_impact"] == 0.65
    assert balanced["guardrails"]["kyc_aml_flags"] is True
    assert balanced["guardrails"]["min_casa_floor"] is True
    assert len(balanced["product_actions"]) > 0


def test_submit_proposal_success(client, db_session):
    # AC: Upon successful submission via the "Submit" button, a non-intrusive confirmation banner must appear at the top of the page.
    # First get product IDs from dashboard
    dashboard_res = client.get("/api/v1/dashboard")
    products = dashboard_res.json()["products"]
    product_id = products[0]["id"]

    payload = {
        "scenario_id": "balanced",
        "proposed_actions": [{"product_id": product_id, "action": "GROW"}],
    }
    response = client.post("/api/v1/proposals", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["scenario_id"] == "balanced"
    assert data["status"] == "SUBMITTED"
    assert data["submitted_by"] == "Sarah Jenkins"
    assert data["routed_to"] == "John Doe (Zonal Head)"
    assert data["guardrails_passed"] is True
    assert "Proposal submitted by Sarah Jenkins" in data["audit_trail"]


def test_submit_proposal_invalid_scenario(client):
    # AC: A dedicated panel that summarizes the implications of the selected scenario and prepares a formal proposal for management review. (Edge case: invalid scenario ID)
    payload = {"scenario_id": "invalid_scenario", "proposed_actions": []}
    response = client.post("/api/v1/proposals", json=payload)
    assert response.status_code == 400
    assert "Invalid scenario_id" in response.json()["detail"]


def test_submit_proposal_invalid_product(client):
    # AC: A dedicated panel that summarizes the implications of the selected scenario and prepares a formal proposal for management review. (Edge case: invalid product ID)
    payload = {
        "scenario_id": "balanced",
        "proposed_actions": [{"product_id": "invalid-product-uuid", "action": "GROW"}],
    }
    response = client.post("/api/v1/proposals", json=payload)
    assert response.status_code == 400
    assert "Invalid product_id" in response.json()["detail"]
