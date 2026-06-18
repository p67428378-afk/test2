def test_fraud_check_passed(client):
    payload = {
        "amount": 1000.0,
        "beneficiary_name": "John Doe",
        "currency": "USD",
        "destination_country": "DE",
    }
    response = client.post("/api/v1/fraud-checks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Passed"
    assert data["score"] < 0.5


def test_fraud_check_manual_review(client):
    payload = {
        "amount": 600000.0,
        "beneficiary_name": "John Doe",
        "currency": "USD",
        "destination_country": "DE",
    }
    response = client.post("/api/v1/fraud-checks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Manual Review"
    assert data["score"] >= 0.5
