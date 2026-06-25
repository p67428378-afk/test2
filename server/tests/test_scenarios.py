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


def test_get_scenario_balanced():
    response = client.get("/api/v1/scenarios/balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "balanced"
    assert "projections" in data
    assert "guardrail_checks" in data
    assert "recommended_actions" in data
    assert data["projections"]["casa_growth"] == 2.5


def test_get_scenario_conservative():
    response = client.get("/api/v1/scenarios/conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "conservative"
    assert data["projections"]["casa_growth"] == 1.2


def test_get_scenario_aggressive():
    response = client.get("/api/v1/scenarios/aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "aggressive"
    assert data["projections"]["casa_growth"] == 4.8


def test_get_scenario_invalid():
    response = client.get("/api/v1/scenarios/invalid_scenario")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario name provided"
