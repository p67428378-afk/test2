from datetime import datetime, timedelta


def test_doctor_schedule_and_appointment_booking(
    client, receptionist_headers, doctor_headers
):
    # 1. Get doctor profile ID
    me_res = client.get("/api/v1/auth/me", headers=doctor_headers)
    assert me_res.status_code == 200
    doctor_id = me_res.json()["id"]

    # 2. Get seeded sample patient ID
    p_res = client.get("/api/v1/patients", headers=receptionist_headers)
    assert p_res.status_code == 200
    patient_id = p_res.json()[0]["id"]

    # 3. Book appointment
    appt_time = (
        (datetime.utcnow() + timedelta(days=1)).replace(microsecond=0).isoformat()
    )
    booking_data = {
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "appointment_time": appt_time,
        "notes": "Routine Checkup",
    }

    res = client.post(
        "/api/v1/appointments", json=booking_data, headers=receptionist_headers
    )
    assert res.status_code == 201
    appt = res.json()
    assert appt["status"] == "SCHEDULED"
    appt_id = appt["id"]

    # 4. Attempt double booking for same doctor and same slot
    dup_res = client.post(
        "/api/v1/appointments", json=booking_data, headers=receptionist_headers
    )
    assert dup_res.status_code == 409

    # 5. Complete appointment and verify automatic invoice creation
    status_res = client.patch(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "COMPLETED"},
        headers=doctor_headers,
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "COMPLETED"

    # Verify auto-generated invoice
    inv_res = client.get(
        f"/api/v1/invoices?patient_id={patient_id}", headers=receptionist_headers
    )
    assert inv_res.status_code == 200
    invoices = inv_res.json()
    assert len(invoices) >= 1
    matching_inv = [i for i in invoices if i["appointment_id"] == appt_id]
    assert len(matching_inv) == 1
    assert matching_inv[0]["amount"] == 150.0
    assert matching_inv[0]["status"] == "PENDING"
