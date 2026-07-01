from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.seed import seed_data

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Seed the test database
db = TestingSessionLocal()
seed_data(db)
db.close()


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "in_stock_rate" in data
    assert "private_brand_pct" in data
    assert "sales_per_linear_ft" in data
    assert "shelf_capacity" in data
    assert data["private_brand_pct"] == 50.0  # 3 private brand out of 6 products seeded


def test_get_sku_performance():
    response = client.get("/api/v1/sku-performance")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 6
    assert len(data["items"]) == 6

    # Test search
    response = client.get("/api/v1/sku-performance?search=Clover")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3

    # Test status filter
    response = client.get("/api/v1/sku-performance?status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


def test_get_scenario_projections():
    # Test balanced
    response = client.post(
        "/api/v1/scenario-projections", json={"scenario_type": "balanced"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "balanced"
    assert data["projected_sales_lift"] == 5.0
    assert data["action_counts"]["grow"] == 12

    # Test conservative
    response = client.post(
        "/api/v1/scenario-projections", json={"scenario_type": "conservative"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_type"] == "conservative"
    assert data["projected_sales_lift"] == 2.5

    # Test invalid scenario
    response = client.post(
        "/api/v1/scenario-projections", json={"scenario_type": "invalid"}
    )
    assert response.status_code == 400


def test_create_assortment_decision():
    payload = {
        "action_counts": {"grow": 12, "maintain": 24, "reduce": 4, "swap": 8},
        "scenario_applied": "balanced",
        "user_name": "Sarah Chen",
    }
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_id" in data
    assert "submitted_at" in data
    assert "Actions: 48 SKUs reviewed, 12 grown, 4 reduced." in data["summary"]

    # Test invalid scenario
    payload["scenario_applied"] = "invalid"
    response = client.post("/api/v1/assortment-decisions", json=payload)
    assert response.status_code == 400
