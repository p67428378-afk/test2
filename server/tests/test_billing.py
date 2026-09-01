from datetime import datetime, timedelta


def test_create_and_update_invoice(client, staff_headers, doctor_headers, db_session):
    from server.models import User, Patient

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    patient = db_session.query(Patient).first()

    # Create slot & appointment for billing
    start = datetime.utcnow() + timedelta(days=9, hours=15)
    end = start + timedelta(minutes=30)
    slot_res = client.post(
        "/api/v1/doctors/slots",
        json={
            "doctor_id": doctor.id,
            "department": "Dermatology",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
        },
        headers=doctor_headers,
    )
    slot_id = slot_res.json()["id"]

    apt_res = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient.id,
            "doctor_id": doctor.id,
            "slot_id": slot_id,
            "reason_for_visit": "Skin lesion biopsy",
        },
        headers=staff_headers,
    )
    apt_id = apt_res.json()["id"]

    # 1. Staff creates itemized invoice
    invoice_payload = {
        "appointment_id": apt_id,
        "patient_id": patient.id,
        "total_amount": 275.50,
        "line_items": [
            {
                "description": "Specialist Consultation Fee",
                "unit_price": 150.00,
                "quantity": 1,
                "amount": 150.00,
            },
            {
                "description": "Dermatological Biopsy Procedure",
                "unit_price": 100.00,
                "quantity": 1,
                "amount": 100.00,
            },
            {
                "description": "Sterile Dressing Kit",
                "unit_price": 25.50,
                "quantity": 1,
                "amount": 25.50,
            },
        ],
        "payment_status": "Pending",
    }
    inv_res = client.post(
        "/api/v1/invoices", json=invoice_payload, headers=staff_headers
    )
    assert inv_res.status_code == 201
    inv_data = inv_res.json()
    assert inv_data["total_amount"] == 275.50
    assert len(inv_data["line_items"]) == 3
    assert inv_data["payment_status"] == "Pending"
    inv_id = inv_data["id"]

    # 2. Retrieve invoice
    get_res = client.get(f"/api/v1/invoices/{inv_id}", headers=staff_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == inv_id

    # 3. List invoices
    list_res = client.get(
        "/api/v1/invoices?payment_status=Pending", headers=staff_headers
    )
    assert list_res.status_code == 200
    assert any(i["id"] == inv_id for i in list_res.json())

    # 4. Update payment status to Paid
    pay_res = client.patch(
        f"/api/v1/invoices/{inv_id}/payment",
        json={"payment_status": "Paid"},
        headers=staff_headers,
    )
    assert pay_res.status_code == 200
    assert pay_res.json()["payment_status"] == "Paid"


def test_create_invoice_unauthorized_doctor(
    client, doctor_headers, patient_headers, db_session
):
    from server.models import Patient, Appointment

    patient = db_session.query(Patient).first()
    apt = db_session.query(Appointment).first()

    payload = {
        "appointment_id": apt.id if apt else "test-id",
        "patient_id": patient.id,
        "total_amount": 100.0,
        "line_items": [],
        "payment_status": "Pending",
    }
    # Doctors cannot directly generate invoices, only Staff or Admin
    res = client.post("/api/v1/invoices", json=payload, headers=doctor_headers)
    assert res.status_code == 403
