import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base, engine, seed_db
from server import models

# Clear any overrides from other tests
app.dependency_overrides.clear()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_db()

def test_get_dashboard_kpis():
    response = client.get("/api/v1/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_pct" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity" in data
    assert data["in_stock_rate"] == 96.2
    assert data["shelf_capacity"] == 84.5

def test_get_dashboard_skus():
    response = client.get("/api/v1/dashboard/skus")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "limit" in data
    assert "page" in data
    assert "total" in data
    assert len(data["items"]) > 0
    
    # Check first item structure
    item = data["items"][0]
    assert "sku_id" in item
    assert "name" in item
    assert "sales" in item
    assert "profit" in item
    assert "volume" in item
    assert "status" in item
