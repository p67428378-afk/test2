def test_get_kpis(client):
    response = client.get("/api/v1/assortment/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["cluster_id"] == "STV-CLUSTER-01"
    assert data["category"] == "Snacks"
    assert "sales_per_linear_ft" in data
    assert "private_brand_mix_pct" in data
    assert "in_stock_rate_pct" in data
    assert "shelf_capacity_utilization_pct" in data
    assert "updated_at" in data
