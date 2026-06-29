from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_advisor.db"

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


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_utilized" in data
    assert data["sales_per_linear_ft"] == 15.75
    assert data["private_brand_percentage"] == 22.5


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Check first item
    first_sku = data[0]
    assert "sku" in first_sku
    assert "product_name" in first_sku
    assert "brand" in first_sku
    assert "sub_category" in first_sku
    assert "sales_velocity" in first_sku
    assert "sales_trend" in first_sku
    assert "status" in first_sku


def test_post_scenario_balanced():
    response = client.post("/api/v1/scenarios/Balanced")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert data["projected_impact"]["sales_per_linear_ft_change"] == 7.5
    assert data["sku_action_summary"]["add"] == 5


def test_post_scenario_conservative():
    response = client.post("/api/v1/scenarios/Conservative")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Conservative"
    assert data["projected_impact"]["sales_per_linear_ft_change"] == 2.1


def test_post_scenario_aggressive():
    response = client.post("/api/v1/scenarios/Aggressive")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Aggressive"
    assert data["projected_impact"]["sales_per_linear_ft_change"] == 12.4


def test_post_scenario_invalid():
    response = client.post("/api/v1/scenarios/InvalidScenario")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid scenario name provided"


def test_post_approval_success():
    response = client.post(
        "/api/v1/approvals",
        json={
            "scenario_name": "Balanced",
            "actions": [
                {"sku": "12345", "action": "GROW"},
                {"sku": "67890", "action": "MAINTAIN"},
            ],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_trail_id" in data
    assert "Success!" in data["message"]


def test_post_approval_invalid():
    response = client.post(
        "/api/v1/approvals", json={"scenario_name": "InvalidScenario", "actions": []}
    )
    assert response.status_code == 400
