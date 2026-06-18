import uuid


def test_create_payment_success(client):
    # 1. Get FX rate lock
    fx_response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=1000"
    )
    assert fx_response.status_code == 200
    rate_lock_id = fx_response.json()["rate_lock_id"]

    # 2. Create payment
    payload = {
        "amount": 1000.0,
        "beneficiary_account_number": "123456789",
        "beneficiary_name": "John Doe",
        "beneficiary_routing_number": "987654321",
        "destination_country": "DE",
        "rate_lock_id": rate_lock_id,
        "settlement_network": "SWIFT",
        "source_account_id": str(uuid.uuid4()),
        "source_currency": "USD",
        "target_currency": "EUR",
    }
    response = client.post("/api/v1/payments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "payment_id" in data
    assert data["compliance_status"] == "Passed"
    assert data["fraud_status"] == "Passed"
    assert data["status"] in [
        "Settled",
        "Failed",
    ]  # Settlement is simulated with random success/failure


def test_create_payment_expired_rate_lock(client):
    payload = {
        "amount": 1000.0,
        "beneficiary_account_number": "123456789",
        "beneficiary_name": "John Doe",
        "beneficiary_routing_number": "987654321",
        "destination_country": "DE",
        "rate_lock_id": str(uuid.uuid4()),  # Non-existent rate lock
        "settlement_network": "SWIFT",
        "source_account_id": str(uuid.uuid4()),
        "source_currency": "USD",
        "target_currency": "EUR",
    }
    response = client.post("/api/v1/payments", json=payload)
    assert response.status_code == 400
    assert "Rate lock expired or invalid" in response.json()["detail"]


def test_create_payment_risk_limit_exceeded(client):
    # 1. Get FX rate lock
    fx_response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=20000000"
    )
    assert fx_response.status_code == 200
    rate_lock_id = fx_response.json()["rate_lock_id"]

    # 2. Create payment
    payload = {
        "amount": 20000000.0,  # Exceeds default exposure limit of 10M
        "beneficiary_account_number": "123456789",
        "beneficiary_name": "John Doe",
        "beneficiary_routing_number": "987654321",
        "destination_country": "DE",
        "rate_lock_id": rate_lock_id,
        "settlement_network": "SWIFT",
        "source_account_id": str(uuid.uuid4()),
        "source_currency": "USD",
        "target_currency": "EUR",
    }
    response = client.post("/api/v1/payments", json=payload)
    assert response.status_code == 403
    assert "exceeds corporate exposure limit" in response.json()["detail"]


def test_create_payment_compliance_failure(client):
    # 1. Get FX rate lock
    fx_response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=1000"
    )
    assert fx_response.status_code == 200
    rate_lock_id = fx_response.json()["rate_lock_id"]

    # 2. Create payment with sanctioned beneficiary
    payload = {
        "amount": 1000.0,
        "beneficiary_account_number": "123456789",
        "beneficiary_name": "SANCTIONED CORP",
        "beneficiary_routing_number": "987654321",
        "destination_country": "DE",
        "rate_lock_id": rate_lock_id,
        "settlement_network": "SWIFT",
        "source_account_id": str(uuid.uuid4()),
        "source_currency": "USD",
        "target_currency": "EUR",
    }
    response = client.post("/api/v1/payments", json=payload)
    assert response.status_code == 403
    assert "Blocked by compliance" in response.json()["detail"]


def test_create_payment_fraud_manual_review(client):
    # 1. Get FX rate lock
    fx_response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=600000"
    )
    assert fx_response.status_code == 200
    rate_lock_id = fx_response.json()["rate_lock_id"]

    # 2. Create payment with high amount (triggers manual review)
    payload = {
        "amount": 600000.0,
        "beneficiary_account_number": "123456789",
        "beneficiary_name": "John Doe",
        "beneficiary_routing_number": "987654321",
        "destination_country": "DE",
        "rate_lock_id": rate_lock_id,
        "settlement_network": "SWIFT",
        "source_account_id": str(uuid.uuid4()),
        "source_currency": "USD",
        "target_currency": "EUR",
    }
    response = client.post("/api/v1/payments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Manual Review"
    assert data["fraud_status"] == "Manual Review"


def test_list_payments(client):
    response = client.get("/api/v1/payments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_payment_detail_not_found(client):
    response = client.get(f"/api/v1/payments/{str(uuid.uuid4())}")
    assert response.status_code == 404
