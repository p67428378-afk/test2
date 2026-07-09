
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.main import app
from server.database import Base
from server.api.v1.endpoints.assortment import get_db
from server import models

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
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
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed a product and performance metric
    p = models.Product(sku="SKU-1001", name="Clover Valley Pretzels", is_private_brand=True)
    db.add(p)
    db.commit()
    db.refresh(p)
    
    pm = models.PerformanceMetric(
        product_id=p.id,
        sales=1250.0,
        profit_margin=35.0,
        days_of_supply=15,
        status_badge="GROW",
        trend_direction="Up"
    )
    db.add(pm)
    db.commit()
    db.close()

def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["in_stock_rate"] == 95.0
    assert data["private_brand_pct"] == 22.0

def test_get_sku_performance():
    response = client.get("/api/v1/sku-performance")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["sku"] == "SKU-1001"
    assert data["items"][0]["trend_direction"] == "Up"

def test_scenario_projections_conservative():
    response = client.post("/api/v1/scenario-projections", json={"scenario_type": "Conservative"})
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "Conservative"
    assert "holiday_lift_pct" not in data or data["holiday_lift_pct"] is None

def test_scenario_projections_aggressive():
    response = client.post("/api/v1/scenario-projections", json={"scenario_type": "Aggressive"})
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "Aggressive"
    assert data["holiday_lift_pct"] == 12.5

def test_scenario_projections_invalid():
    response = client.post("/api/v1/scenario-projections", json={"scenario_type": "Invalid"})
    assert response.status_code == 400

def test_submit_assortment_decision():
    response = client.post("/api/v1/assortment-decisions", json={"scenario_type": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_id" in data
    assert "submitted_at" in data
