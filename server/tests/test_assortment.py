from server.tests.conftest import client, TestingSessionLocal
from server.main import seed_data


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the DG Cluster Assortment Advisor API"
    }


def test_get_kpis():
    # Ensure seeded
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_per_linear_ft"] == 15.75
    assert data["private_brand_pct"] == 22.0
    assert data["in_stock_rate"] == 98.2
    assert data["shelf_capacity"] == 85.0


def test_get_skus():
    # Ensure seeded
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] == 5
    assert len(data["items"]) == 5
    assert data["items"][0]["sku"] == "19482"  # Sorted by SKU asc by default


def test_get_skus_with_filters():
    # Ensure seeded
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    # Search filter
    response = client.get("/api/v1/skus?search=Clover")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2

    # Brand filter
    response = client.get("/api/v1/skus?brand=Lays")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1

    # Status filter
    response = client.get("/api/v1/skus?status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


def test_get_scenarios():
    response = client.get("/api/v1/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[1]["id"] == "balanced"
    assert data[1]["private_brand_pct"] == 25.2


def test_submit_plan():
    # Ensure seeded
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    payload = {
        "selected_scenario": "balanced",
        "sku_actions": [
            {"sku": "48291", "action": "GROW"},
            {"sku": "57201", "action": "SWAP"},
        ],
    }
    response = client.post("/api/v1/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["scenario"] == "balanced"
    assert data["manager_name"] == "Sarah Jenkins"
    assert "audit_id" in data
    assert "submitted_at" in data


def test_submit_plan_invalid_scenario():
    payload = {"selected_scenario": "invalid_scenario", "sku_actions": []}
    response = client.post("/api/v1/submit", json=payload)
    assert response.status_code == 422
