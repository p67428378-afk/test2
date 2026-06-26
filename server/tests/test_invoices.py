def test_create_invoice(client):
    # AC: Billing: Generate a new invoice for services rendered via POST /api/v1/invoices
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    patient_id = p_resp.json()["id"]

    response = client.post(
        "/api/v1/invoices",
        json={
            "patient_id": patient_id,
            "amount": 100.00,
            "tax": 10.00,
            "discount": 5.00,
            "billing_code": "CONSULT-01",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["total_amount"] == 105.00
    assert data["status"] == "unpaid"
    assert data["billing_code"] == "CONSULT-01"


def test_submit_insurance_claim(client):
    # AC: Billing: Manage insurance claims via POST /api/v1/invoices/{id}/claim
    p_resp = client.post(
        "/api/v1/patients",
        json={
            "name": "Jane Doe",
            "date_of_birth": "1995-02-02",
            "gender": "Female",
            "insurance_provider": "BlueCross",
            "insurance_policy_number": "BC12345",
        },
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

    response = client.post(f"/api/v1/invoices/{invoice_id}/claim")
    assert response.status_code == 200
    assert response.json()["status"] == "claim_pending"
    assert response.json()["insurance_provider"] == "BlueCross"
