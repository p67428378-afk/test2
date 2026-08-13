from datetime import datetime, timedelta, timezone


def test_return_checkin_on_time(
    client, user_token_headers, admin_token_headers, sample_equipment
):
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=3)
    end_date = now - timedelta(days=1)

    res = client.post(
        "/api/v1/rentals",
        json={
            "equipment_id": sample_equipment.id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "payment_method_token": "pm_mock_token_123",
        },
        headers=user_token_headers,
    )
    rental_id = res.json()["id"]

    checkin_res = client.post(
        "/api/v1/returns/check-in",
        json={
            "rental_id": rental_id,
            "actual_return_date": end_date.isoformat(),
            "damage_assessment_amount": 0.0,
        },
        headers=admin_token_headers,
    )
    assert checkin_res.status_code == 200
    data = checkin_res.json()
    assert data["status"] == "RETURNED"
    assert data["late_fee"] == 0.0
    assert data["refund_amount"] == sample_equipment.deposit_amount


def test_return_checkin_late_with_fee(
    client, user_token_headers, admin_token_headers, sample_equipment
):
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=5)
    end_date = now - timedelta(days=3)
    actual_return_date = now - timedelta(days=1)  # 2 days late

    res = client.post(
        "/api/v1/rentals",
        json={
            "equipment_id": sample_equipment.id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "payment_method_token": "pm_mock_token_123",
        },
        headers=user_token_headers,
    )
    rental_id = res.json()["id"]

    checkin_res = client.post(
        "/api/v1/returns/check-in",
        json={
            "rental_id": rental_id,
            "actual_return_date": actual_return_date.isoformat(),
            "damage_assessment_amount": 0.0,
        },
        headers=admin_token_headers,
    )
    assert checkin_res.status_code == 200
    data = checkin_res.json()
    assert data["status"] == "RETURNED"
    assert data["days_late"] == 2
    assert data["late_fee"] == 2 * sample_equipment.daily_rate
    expected_refund = sample_equipment.deposit_amount - (
        2 * sample_equipment.daily_rate
    )
    assert data["refund_amount"] == max(0.0, expected_refund)
