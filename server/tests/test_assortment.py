def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_get_kpis_success(client):
    response = client.get("/api/v1/assortment/kpis?cluster_id=small-town-value")
    assert response.status_code == 200
    data = response.json()
    assert data["cluster_id"] == "small-town-value"
    assert data["sales_per_linear_ft"] == 245.50
    assert data["private_brand_share_pct"] == 28.5
    assert data["instock_rate_pct"] == 96.2
    assert data["shelf_capacity_utilization_pct"] == 92.0
    assert "last_updated" in data


def test_get_kpis_not_found(client):
    response = client.get("/api/v1/assortment/kpis?cluster_id=non-existent-cluster")
    assert response.status_code == 404
    assert response.json()["detail"] == "Cluster 'non-existent-cluster' not found."


def test_get_skus_default(client):
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 1
    assert len(data["skus"]) >= 1

    first_sku = data["skus"][0]
    assert "sku_id" in first_sku
    assert "name" in first_sku
    assert "status_badge" in first_sku
    assert "velocity_units_per_wk" in first_sku


def test_get_skus_with_category_filter(client):
    response = client.get(
        "/api/v1/assortment/skus?cluster_id=small-town-value&category=Snacks"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 1


def test_get_scenarios(client):
    response = client.get("/api/v1/assortment/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert data["default_selected"] == "balanced"
    assert len(data["scenarios"]) == 3

    scenario_ids = [s["id"] for s in data["scenarios"]]
    assert "conservative" in scenario_ids
    assert "balanced" in scenario_ids
    assert "aggressive" in scenario_ids


def test_submit_recommendation_success(client):
    payload = {
        "cluster_id": "small-town-value",
        "scenario_id": "balanced",
        "manager_id": "mgr-aarchi-jain",
        "notes": "Approved Q3 Snacks cluster optimization",
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["submitted_by"] == "mgr-aarchi-jain"
    assert data["scenario"] == "balanced"
    assert data["audit_reference_id"].startswith("AUD-2026-")
    assert data["summary"]["guardrails_satisfied"] is True


def test_submit_recommendation_invalid_scenario(client):
    payload = {
        "cluster_id": "small-town-value",
        "scenario_id": "ultra-aggressive",
        "manager_id": "mgr-aarchi-jain",
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 400
    assert "Invalid scenario_id" in response.json()["detail"]


def test_submit_recommendation_invalid_cluster(client):
    payload = {
        "cluster_id": "invalid-cluster",
        "scenario_id": "balanced",
        "manager_id": "mgr-aarchi-jain",
    }
    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 400
    assert "not found" in response.json()["detail"]
