def test_get_fx_rates_success(client):
    response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=1000"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["source_currency"] == "USD"
    assert data["target_currency"] == "EUR"
    assert data["rate"] > 0
    assert data["converted_amount"] > 0
    assert "rate_lock_id" in data


def test_get_fx_rates_invalid_amount(client):
    response = client.get(
        "/api/v1/fx-rates?source_currency=USD&target_currency=EUR&amount=-100"
    )
    assert response.status_code == 400
    assert "Amount must be greater than zero" in response.json()["detail"]


def test_get_fx_rates_invalid_currency(client):
    response = client.get(
        "/api/v1/fx-rates?source_currency=US&target_currency=EUR&amount=100"
    )
    assert response.status_code == 400
    assert "Invalid currency pair" in response.json()["detail"]
