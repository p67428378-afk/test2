def test_process_payment(client):
    # AC: Billing: Process a payment for an invoice via POST /api/v1/payments
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    patient_id = p_resp.json()["id"]

    inv_resp = client.post(
        "/api/v1/invoices",
        json={
            "patient_id": patient_id,
            "amount": 100.00,
            "tax": 10.00,
            "discount": 5.00,
            "billing_code": "CONSULT-01",
        },
    )
    invoice_id = inv_resp.json()["id"]

    response = client.post(
        "/api/v1/payments",
        json={
            "invoice_id": invoice_id,
            "amount": 105.00,
            "payment_method": "Credit Card",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 105.00
    assert data["payment_method"] == "Credit Card"


def test_process_payment_exceeds_balance(client):
    # AC: Billing: Prevent payment amount exceeding remaining invoice balance
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    patient_id = p_resp.json()["id"]

    inv_resp = client.post(
        "/api/v1/invoices",
        json={
            "patient_id": patient_id,
            "amount": 100.00,
            "tax": 10.00,
            "discount": 5.00,
            "billing_code": "CONSULT-01",
        },
    )
    invoice_id = inv_resp.json()["id"]

    response = client.post(
        "/api/v1/payments",
        json={
            "invoice_id": invoice_id,
            "amount": 200.00,
            "payment_method": "Credit Card",
        },
    )
    assert response.status_code == 400
    assert "exceeds" in response.json()["detail"].lower()
