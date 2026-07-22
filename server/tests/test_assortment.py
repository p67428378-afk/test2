from fastapi.testclient import TestClient


def test_get_kpis(client: TestClient):
    response = client.get("/api/v1/assortment/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_utilized" in data
    assert data["sales_per_linear_ft"] == 152.50
    assert data["shelf_capacity_utilized"] == 88.0


def test_get_skus(client: TestClient):
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Check fields of first SKU
    sku = data[0]
    assert "id" in sku
    assert "sku_name" in sku
    assert "upc" in sku
    assert "sales_rank_percentile" in sku
    assert "weekly_sales" in sku
    assert "margin_percentage" in sku
    assert "is_private_brand" in sku
    assert "status" in sku


def test_get_skus_search(client: TestClient):
    response = client.get("/api/v1/assortment/skus?search=Lay")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert "Lay's Classic" in data[0]["sku_name"]


def test_get_skus_sort(client: TestClient):
    response = client.get("/api/v1/assortment/skus?sortBy=weekly_sales&sortOrder=desc")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["weekly_sales"] >= data[1]["weekly_sales"]


def test_post_scenario_balanced(client: TestClient):
    response = client.post(
        "/api/v1/assortment/scenario", json={"scenario_name": "balanced"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "balanced"
    assert data["projected_private_brand_percentage"] == 21.5
    assert data["projected_total_sales"] == 510000.00
    assert len(data["guardrails"]) == 2
    assert data["guardrails"][0]["name"] == "Projected Private Brand % > 15%"
    assert data["guardrails"][0]["pass"] is True
    assert "actions" in data
    assert "add" in data["actions"]
    assert "reduce" in data["actions"]
    assert "swap" in data["actions"]


def test_post_scenario_invalid(client: TestClient):
    response = client.post(
        "/api/v1/assortment/scenario", json={"scenario_name": "invalid_scenario"}
    )
    assert response.status_code == 422


def test_post_submit_success(client: TestClient):
    # Get scenario first to have valid payload
    scenario_resp = client.post(
        "/api/v1/assortment/scenario", json={"scenario_name": "balanced"}
    )
    assert scenario_resp.status_code == 200
    scenario_data = scenario_resp.json()

    # Submit
    submit_resp = client.post("/api/v1/assortment/submit", json=scenario_data)
    assert submit_resp.status_code == 201
    submit_data = submit_resp.json()
    assert "audit_trail_id" in submit_data
    assert submit_data["status"] == "SUBMITTED"
    assert "submitted_at" in submit_data


def test_post_submit_failed_guardrail(client: TestClient):
    # Create payload with failing guardrail
    payload = {
        "scenario_name": "balanced",
        "projected_private_brand_percentage": 12.0,
        "projected_total_sales": 510000.00,
        "guardrails": [
            {"name": "Projected Private Brand % > 15%", "pass": False},
            {"name": "Shelf Capacity < 95%", "pass": True},
        ],
        "actions": {"add": [], "reduce": [], "swap": []},
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 400
    assert "not met" in response.json()["detail"]
