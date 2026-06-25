import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base
from server import models
import uuid

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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
def seed_db():
    db = TestingSessionLocal()
    Base.metadata.create_all(bind=engine)

    default_products = [
        {
            "product_id": uuid.UUID("a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"),
            "name": "Savings Account Variant A",
            "category": "Savings",
            "aum_contribution": 45000000.0,
            "npa_percentage": 0.0,
            "status": "GROW",
        },
        {
            "product_id": uuid.UUID("b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e"),
            "name": "Personal Loan Type C",
            "category": "Loans",
            "aum_contribution": 15000000.0,
            "npa_percentage": 4.2,
            "status": "REDUCE",
        },
    ]

    for prod in default_products:
        existing = (
            db.query(models.Product)
            .filter(models.Product.product_id == prod["product_id"])
            .first()
        )
        if not existing:
            db_prod = models.Product(**prod)
            db.add(db_prod)
    db.commit()
    db.close()


def test_submit_approval_success():
    # First, get a valid product ID from the products endpoint
    prod_response = client.get("/api/v1/products")
    assert prod_response.status_code == 200
    products = prod_response.json()
    assert len(products) > 0
    product_id = products[0]["product_id"]

    # Submit approval
    payload = {
        "selected_scenario": "balanced",
        "product_actions": [{"product_id": product_id, "recommended_action": "GROW"}],
    }
    response = client.post("/api/v1/approvals/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audit_trail" in data
    assert data["audit_trail"]["approved_by"] == "Product Manager Cluster A"
    assert data["audit_trail"]["scenario_name"] == "balanced"


def test_submit_approval_fail_guardrail():
    payload = {"selected_scenario": "fail_guardrail", "product_actions": []}
    response = client.post("/api/v1/approvals/submit", json=payload)
    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Guardrail check failed (e.g., minimum CASA floor violated)"
    )


def test_submit_approval_invalid_scenario():
    payload = {"selected_scenario": "invalid_scenario", "product_actions": []}
    response = client.post("/api/v1/approvals/submit", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario name provided"
