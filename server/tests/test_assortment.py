def test_get_kpis(client):
    response = client.get("/api/v1/assortment/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_foot" in data or "sales_per_linear_ft" in data
    assert "private_brand_mix_pct" in data
    assert "in_stock_rate_pct" in data
    assert "shelf_capacity_utilization_pct" in data


def test_get_skus(client):
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert "skus" in data
    skus_list = data["skus"]
    assert isinstance(skus_list, list)
    if len(skus_list) > 0:
        first = skus_list[0]
        assert "sku_id" in first
        assert "product_name" in first
        assert "sub_category" in first
        assert "margin_pct" in first
        assert "linear_space_ft" in first
        assert "status_badge" in first


def test_get_scenarios(client):
    response = client.get("/api/v1/assortment/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert "scenarios" in data
    scenarios_list = data["scenarios"]
    assert isinstance(scenarios_list, list)
    assert len(scenarios_list) >= 3
    scenario_names = [s.get("scenario_name") or s.get("name") for s in scenarios_list]
    assert "Conservative" in scenario_names
    assert "Balanced" in scenario_names
    assert "Aggressive" in scenario_names


def test_create_submission(client):
    payload = {
        "selected_scenario": "Balanced",
        "scenario_name": "Balanced",
        "cluster_id": "STV-CLUSTER-01",
        "category": "Snacks",
        "user_id": "usr_9921",
    }
    response = client.post("/api/v1/assortment/submissions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "submission_id" in data
    assert "audit_ref_id" in data
    assert data["status"] == "APPROVED_AND_LOGGED"
    assert data["scenario_name"] == "Balanced"
