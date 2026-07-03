from fastapi.testclient import TestClient
from server.database import get_db, SessionLocal
from server.main import app


# Override get_db dependency to use the standard test database engine (which is already created and seeded by main.py)
def override_get_db():
    db = SessionLocal()
    try:
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


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    # Sort by sku_id to ensure deterministic order in test assertion
    sorted_data = sorted(data, key=lambda x: x["sku_id"])
    assert sorted_data[0]["sku_id"] == "11223"


def test_get_skus_search():
    response = client.get("/api/v1/skus?search=Chips")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert "Chips" in data[0]["product_name"]


def test_get_skus_invalid_sort():
    response = client.get("/api/v1/skus?sort_by=invalid_col")
    assert response.status_code == 400


def test_post_scenarios_balanced():
    response = client.post("/api/v1/scenarios", json={"scenario_name": "Balanced"})
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert len(data["sku_actions"]) > 0


def test_post_scenarios_invalid():
    response = client.post(
        "/api/v1/scenarios", json={"scenario_name": "InvalidScenario"}
    )
    assert response.status_code == 422


def test_post_decisions():
    payload = {
        "scenario_name": "Balanced",
        "sku_actions": [
            {"action": "ADD", "sku_id": "11223"},
            {"action": "REMOVE", "sku_id": "67890"},
        ],
    }
    response = client.post("/api/v1/decisions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audit_trail_id" in data
