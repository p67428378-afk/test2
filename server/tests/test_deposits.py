from datetime import datetime, timedelta, timezone


def test_create_deposit_hold(client, user_token_headers, sample_equipment):
    now = datetime.now(timezone.utc)
    start_date = (now + timedelta(days=10)).isoformat()
    end_date = (now + timedelta(days=12)).isoformat()

    res = client.post(
        "/api/v1/rentals",
        json={
            "equipment_id": sample_equipment.id,
            "start_date": start_date,
            "end_date": end_date,
            "payment_method_token": "pm_mock_token_123",
        },
        headers=user_token_headers,
    )
    rental_id = res.json()["id"]

    hold_res = client.post(
        "/api/v1/deposits/hold",
        json={
            "rental_id": rental_id,
            "amount": 200.0,
            "payment_method_id": "pm_test_card",
        },
        headers=user_token_headers,
    )
    assert hold_res.status_code == 200
    data = hold_res.json()
    assert data["rental_id"] == rental_id
    assert data["amount"] == 200.0
    assert data["transaction_type"] == "DEPOSIT"
