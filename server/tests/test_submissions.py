def test_post_submission_success(client):
    payload = {
        "cluster_id": "STV-CLUSTER-01",
        "category": "Snacks",
        "scenario_name": "Balanced",
        "user_id": "USR-CM-882",
        "guardrails_override": False,
    }
    response = client.post("/api/v1/assortment/submissions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "APPROVED_AND_LOGGED"
    assert data["scenario_name"] == "Balanced"
    assert "submission_id" in data
    assert "audit_ref_id" in data
    assert data["guardrails_status"] in ["PASSED", "PASSED_WITH_OVERRIDE"]


def test_post_submission_invalid_scenario(client):
    payload = {
        "cluster_id": "STV-CLUSTER-01",
        "category": "Snacks",
        "scenario_name": "NonExistentScenario",
        "user_id": "USR-CM-882",
        "guardrails_override": False,
    }
    response = client.post("/api/v1/assortment/submissions", json=payload)
    assert response.status_code == 400
