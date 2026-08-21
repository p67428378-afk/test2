from datetime import datetime, timedelta


def test_billing_and_invoice_payment(client, receptionist_headers, doctor_headers):
    # Setup appointment
    doc_res = client.get("/api/v1/auth/me", headers=doctor_headers)
    doctor_id = doc_res.json()["id"]

    p_res = client.get("/api/v1/patients", headers=receptionist_headers)
    patient_id = p_res.json()[0]["id"]

    appt_time = (
        (datetime.utcnow() + timedelta(days=3)).replace(microsecond=0).isoformat()
    )
    appt_res = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_time": appt_time,
            "notes": "Billing test appointment",
        },
        headers=receptionist_headers,
    )
    appt_id = appt_res.json()["id"]

    # Complete appointment to trigger auto invoice
    client.patch(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "COMPLETED"},
        headers=doctor_headers,
    )

    # Fetch invoice
    inv_list_res = client.get(
        f"/api/v1/invoices?patient_id={patient_id}", headers=receptionist_headers
    )
    assert inv_list_res.status_code == 200
    invoices = inv_list_res.json()
    invoice = [i for i in invoices if i["appointment_id"] == appt_id][0]
    invoice_id = invoice["id"]
    assert invoice["status"] == "PENDING"

    # Pay invoice
    pay_res = client.post(
        f"/api/v1/invoices/{invoice_id}/pay", headers=receptionist_headers
    )
    assert pay_res.status_code == 200
    assert pay_res.json()["status"] == "PAID"

    # Pay already paid invoice should return 400
    dup_pay_res = client.post(
        f"/api/v1/invoices/{invoice_id}/pay", headers=receptionist_headers
    )
    assert dup_pay_res.status_code == 400
