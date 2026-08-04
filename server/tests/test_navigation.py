def test_get_navigation_tabs(client):
    response = client.get("/api/v1/navigation/tabs")
    assert response.status_code == 200
    data = response.json()
    assert "sidebar_tabs" in data
    assert "topnav_tabs" in data
    assert len(data["sidebar_tabs"]) >= 5
    assert len(data["topnav_tabs"]) >= 4

    sidebar_ids = [t["id"] for t in data["sidebar_tabs"]]
    assert "overview" in sidebar_ids
    assert "category_strategy" in sidebar_ids
    assert "sku_performance" in sidebar_ids
    assert "store_clusters" in sidebar_ids
    assert "audit_history" in sidebar_ids

    topnav_ids = [t["id"] for t in data["topnav_tabs"]]
    assert "assortment_advisor" in topnav_ids
    assert "scenario_modeler" in topnav_ids
    assert "guardrail_rules" in topnav_ids
    assert "approval_queue" in topnav_ids
