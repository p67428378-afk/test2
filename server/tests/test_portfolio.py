"""
Module: server.tests.test_portfolio
Purpose: Unit and integration tests for the Portfolio Optimizer API.
Author: Backend Developer Agent
Created: 2026-06-24
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db
from server import models

# Use DATABASE_URL from env or fallback to in-memory SQLite
DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
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
def clean_db():
    # Clean tables before each test to ensure isolation
    db = TestingSessionLocal()
    db.query(models.GuardrailCheck).delete()
    db.query(models.DecisionAudit).delete()
    db.query(models.ProductMetric).delete()
    db.query(models.Product).delete()
    db.query(models.Scenario).delete()
    db.commit()
    db.close()


def test_get_dashboard_data():
    # AC: The dashboard must prominently display a header with key performance indicators (KPIs)
    # AC: A detailed table must list all retail products with their key performance metrics
    # AC: The user must be able to select one of three predefined scenarios
    response = client.get("/api/v1/dashboard-data")
    assert response.status_code == 200
    data = response.json()

    # Verify KPIs
    assert "kpis" in data
    assert data["kpis"]["business_per_branch"] == "₹1.2 Cr"
    assert data["kpis"]["capacity_utilization"] == 85.0
    assert data["kpis"]["casa_ratio"] == 42.5
    assert data["kpis"]["scheme_availability_rate"] == 99.8

    # Verify Products
    assert "products" in data
    assert len(data["products"]) == 6
    product_names = [p["name"] for p in data["products"]]
    assert "Savings Elite" in product_names
    assert "PL Express" in product_names

    # Verify Scenarios
    assert "scenarios" in data
    assert len(data["scenarios"]) == 3
    scenario_names = [s["name"] for s in data["scenarios"]]
    assert "Conservative" in scenario_names
    assert "Balanced" in scenario_names
    assert "Aggressive" in scenario_names


def test_submit_decision_success():
    # AC: This section summarizes the actions for the selected scenario and performs automated guardrail checks before submission.
    # AC: Upon successful submission, a confirmation banner must appear at the top of the page, providing a summary for audit and regulatory purposes.

    # First, get dashboard data to seed the database and retrieve scenario IDs
    get_resp = client.get("/api/v1/dashboard-data")
    assert get_resp.status_code == 200
    scenarios = get_resp.json()["scenarios"]

    # Find the Balanced scenario
    balanced_scenario = next(s for s in scenarios if s["name"] == "Balanced")

    # Submit decision
    payload = {"approver_name": "Ananya Sharma", "scenario_id": balanced_scenario["id"]}
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert "decision_id" in data
    assert data["scenario_name"] == "Balanced"
    assert data["approver_name"] == "Ananya Sharma"
    assert data["guardrails_passed"] == 4
    assert data["total_guardrails"] == 4
    assert "All 4 guardrails passed successfully" in data["audit_trail_summary"]


def test_submit_decision_invalid_scenario():
    # AC: This section summarizes the actions for the selected scenario and performs automated guardrail checks before submission.
    payload = {
        "approver_name": "Ananya Sharma",
        "scenario_id": "00000000-0000-0000-0000-000000000000",
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario selected"


def test_submit_decision_guardrail_failure():
    # AC: This section summarizes the actions for the selected scenario and performs automated guardrail checks before submission.

    # First, get dashboard data to seed the database and retrieve scenario IDs
    get_resp = client.get("/api/v1/dashboard-data")
    assert get_resp.status_code == 200
    scenarios = get_resp.json()["scenarios"]

    # Find the Aggressive scenario (which fails RBI exposure norms)
    aggressive_scenario = next(s for s in scenarios if s["name"] == "Aggressive")

    # Submit decision
    payload = {
        "approver_name": "Ananya Sharma",
        "scenario_id": aggressive_scenario["id"],
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 422
    assert response.json()["detail"] == "Guardrail checks failed"
