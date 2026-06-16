import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_get_kpis_default(client):
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 45.5
    assert data["private_brand_percentage"] == 15.2
    assert data["in_stock_rate"] == 94.8
    assert data["shelf_capacity"] == 85

def test_get_kpis_conservative(client):
    response = client.get("/api/v1/kpis?scenario=Conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 40.0
    assert data["private_brand_percentage"] == 14.0
    assert data["in_stock_rate"] == 96.5
    assert data["shelf_capacity"] == 80

def test_get_kpis_aggressive(client):
    response = client.get("/api/v1/kpis?scenario=aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 55.0
    assert data["private_brand_percentage"] == 18.5
    assert data["in_stock_rate"] == 92.0
    assert data["shelf_capacity"] == 90

def test_get_kpis_invalid(client):
    response = client.get("/api/v1/kpis?scenario=invalid_scen")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario name provided"

def test_get_skus_default(client):
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 6
    # Check that Lay's Classic is GROW by default
    lays = next(s for s in data if s["id"] == "3fa85f64-5717-4562-b3fc-2c963f66afa1")
    assert lays["recommended_action"] == "GROW"

def test_get_skus_conservative(client):
    response = client.get("/api/v1/skus?scenario=Conservative")
    assert response.status_code == 200
    data = response.json()
    lays = next(s for s in data if s["id"] == "3fa85f64-5717-4562-b3fc-2c963f66afa1")
    assert lays["recommended_action"] == "MAINTAIN"

def test_get_skus_invalid(client):
    response = client.get("/api/v1/skus?scenario=invalid_scen")
    assert response.status_code == 400

def test_create_decision_success(client):
    # First fetch SKUs to ensure they are seeded
    client.get("/api/v1/skus")
    
    payload = {
        "scenario_name": "Balanced",
        "submitted_by": "category_manager@dollargeneral.com",
        "items": [
            {
                "sku_id": "3fa85f64-5717-4562-b3fc-2c963f66afa1",
                "action": "GROW"
            }
        ]
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert data["submitted_by"] == "category_manager@dollargeneral.com"
    assert data["status"] == "APPROVED"
    assert "audit_id" in data
    assert "id" in data

def test_create_decision_invalid_sku(client):
    payload = {
        "scenario_name": "Balanced",
        "submitted_by": "category_manager@dollargeneral.com",
        "items": [
            {
                "sku_id": str(uuid.uuid4()),
                "action": "GROW"
            }
        ]
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 400
    assert "not found" in response.json()["detail"]

def test_create_decision_invalid_scenario(client):
    payload = {
        "scenario_name": "InvalidScen",
        "submitted_by": "category_manager@dollargeneral.com",
        "items": []
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 400
