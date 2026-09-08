def test_get_codebase_analyzer_report(client):
    response = client.get("/api/v1/codebase-analyzer/report?issue_key=SCRUM-231")
    assert response.status_code == 200
    data = response.json()
    assert data["issue_key"] == "SCRUM-231"
    assert data["status"] == "completed"
    assert "metrics" in data
    assert "tech_stack" in data
    assert data["metrics"]["test_pass_rate"] == "100%"
    assert data["metrics"]["total_tests"] == 21


def test_trigger_codebase_analysis(client):
    payload = {
        "issue_key": "SCRUM-231",
        "repo_url": "https://github.com/p67428378-afk/test2",
        "branch_name": "staging/ISSUE-SCRUM-231",
    }
    response = client.post("/api/v1/codebase-analyzer/run", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["issue_key"] == "SCRUM-231"
    assert data["status"] == "completed"
    assert "triggered_at" in data
