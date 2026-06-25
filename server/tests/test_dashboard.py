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


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "business_per_branch" in data
    assert "capacity_utilization" in data
    assert "casa_ratio" in data
    assert "scheme_availability" in data
    assert data["casa_ratio"] == 42.5


def test_get_products():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Check that seeded products are returned
    product_names = [p["name"] for p in data]
    assert "Savings Account Variant A" in product_names
    assert "Personal Loan Type C" in product_names
