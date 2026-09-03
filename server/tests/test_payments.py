from datetime import date, timedelta


def test_payment_tracking_deposit_and_full_payment(client, customer_headers):
    photo_id = "22222222-2222-2222-2222-222222222222"
    pkg_id = "33333333-3333-3333-3333-333333333331"  # $350

    target_date = date.today() + timedelta(days=25)
    start_time_iso = f"{target_date.isoformat()}T11:00:00"

    # 1. Book session ($350 total, $175 deposit)
    book_res = client.post(
        "/api/v1/sessions",
        json={
            "photographer_id": photo_id,
            "package_id": pkg_id,
            "start_time": start_time_iso,
            "event_notes": "Studio headshots",
        },
        headers=customer_headers,
    )
    assert book_res.status_code == 201
    sess_id = book_res.json()["id"]

    # 2. Pay 50% deposit ($175) -> Payment status Partial, Session status Confirmed
    pay_deposit_res = client.post(
        "/api/v1/payments",
        json={"session_id": sess_id, "amount": 175.00, "payment_method": "credit_card"},
        headers=customer_headers,
    )
    assert pay_deposit_res.status_code == 201
    dep_data = pay_deposit_res.json()
    assert dep_data["payment_status"] == "partial"
    assert dep_data["total_paid"] == 175.00
    assert dep_data["remaining_balance"] == 175.00
    assert dep_data["session_status"] == "confirmed"

    # 3. Pay Remaining Balance ($175) -> Payment status Paid
    pay_final_res = client.post(
        "/api/v1/payments",
        json={"session_id": sess_id, "amount": 175.00, "payment_method": "credit_card"},
        headers=customer_headers,
    )
    assert pay_final_res.status_code == 201
    final_data = pay_final_res.json()
    assert final_data["payment_status"] == "paid"
    assert final_data["total_paid"] == 350.00
    assert final_data["remaining_balance"] == 0.0

    # 4. List payments for session
    list_res = client.get(
        f"/api/v1/payments?session_id={sess_id}", headers=customer_headers
    )
    assert list_res.status_code == 200
    payments = list_res.json()
    assert len(payments) == 2
