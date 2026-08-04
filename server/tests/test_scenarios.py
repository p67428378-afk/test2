def test_get_scenarios(client):
    response = client.get("/api/v1/assortment/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert data["cluster_id"] == "STV-CLUSTER-01"
    assert data["default_scenario"] == "Balanced"
    assert len(data["scenarios"]) == 3
    scenario_names = [s["name"] for s in data["scenarios"]]
    assert "Conservative" in scenario_names
    assert "Balanced" in scenario_names
    assert "Aggressive" in scenario_names
    for s in data["scenarios"]:
        assert "action_summary" in s
        assert "GROW" in s["action_summary"]
