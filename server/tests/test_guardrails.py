def test_get_guardrails(client):
    response = client.get("/api/v1/guardrails")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    first = data[0]
    assert "id" in first
    assert "rule_name" in first
    assert "metric_key" in first
    assert "operator" in first
    assert "threshold_value" in first
