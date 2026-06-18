def test_risk_validation_valid(client):
    payload = {"amount": 1000.0, "country": "DE", "currency": "USD"}
    response = client.post("/api/v1/risk-validations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True


def test_risk_validation_invalid(client):
    payload = {
        "amount": 20000000.0,  # Exceeds default exposure limit of 10M
        "country": "DE",
        "currency": "USD",
    }
    response = client.post("/api/v1/risk-validations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert "exceeds corporate exposure limit" in data["reason"]
