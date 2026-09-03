"""Unit and integration tests for Payment processing and ledger tracking."""


def test_list_payments(client):
    response = client.get("/api/v1/payments")
    assert response.status_code == 200
    payments = response.json()
    assert len(payments) >= 1
    sample = payments[0]
    assert "amount" in sample
    assert "payment_status" in sample


def test_process_deposit_and_full_balance_payment(client):
    # 1. Create new session
    photogs = client.get("/api/v1/photographers").json()
    pkgs = client.get("/api/v1/packages").json()
    family_pkg = next(p for p in pkgs if "Family" in p["name"])

    sess_res = client.post(
        "/api/v1/sessions",
        json={
            "photographer_id": photogs[0]["id"],
            "package_id": family_pkg["id"],
            "start_time": "2026-08-10T14:00:00",
            "event_notes": "Family portraits in park.",
            "add_on_ids": [],
        },
    )
    assert sess_res.status_code == 201
    session_data = sess_res.json()
    session_id = session_data["id"]
    deposit_needed = session_data["deposit_amount"]  # 250.0

    # 2. Process Deposit Payment (50%)
    deposit_payload = {
        "session_id": session_id,
        "amount": deposit_needed,
        "payment_method": "credit_card",
        "transaction_reference": f"TXN-DEP-{session_id[:8]}",
    }
    dep_res = client.post("/api/v1/payments", json=deposit_payload)
    assert dep_res.status_code == 201
    dep_data = dep_res.json()
    assert dep_data["payment_status"] == "Partial"
    assert dep_data["session_status"] == "Confirmed"
    assert dep_data["remaining_balance"] == 250.0

    # 3. Process Remaining Balance Payment (50%)
    balance_payload = {
        "session_id": session_id,
        "amount": 250.0,
        "payment_method": "credit_card",
        "transaction_reference": f"TXN-BAL-{session_id[:8]}",
    }
    bal_res = client.post("/api/v1/payments", json=balance_payload)
    assert bal_res.status_code == 201
    bal_data = bal_res.json()
    assert bal_data["payment_status"] == "Paid"
    assert bal_data["session_status"] == "Confirmed"
    assert bal_data["remaining_balance"] == 0.0
