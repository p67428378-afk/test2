from datetime import datetime, timedelta


def test_medical_record_and_prescription_flow(
    client, doctor_headers, receptionist_headers
):
    # Get doctor ID
    doc_res = client.get("/api/v1/auth/me", headers=doctor_headers)
    doctor_id = doc_res.json()["id"]

    # Get patient ID
    p_res = client.get("/api/v1/patients", headers=receptionist_headers)
    patient_id = p_res.json()[0]["id"]

    # Create appointment
    appt_time = (
        (datetime.utcnow() + timedelta(days=2)).replace(microsecond=0).isoformat()
    )
    appt_res = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_time": appt_time,
            "notes": "Consultation for medical record",
        },
        headers=receptionist_headers,
    )
    assert appt_res.status_code == 201
    appointment_id = appt_res.json()["id"]

    # Receptionist attempts to create medical record (should fail with 403)
    record_data = {
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "appointment_id": appointment_id,
        "diagnosis": "Acute Bronchitis",
        "notes": "Patient advised rest and hydration.",
    }
    forbidden_res = client.post(
        "/api/v1/medical-records", json=record_data, headers=receptionist_headers
    )
    assert forbidden_res.status_code == 403

    # Doctor creates medical record (should succeed)
    record_res = client.post(
        "/api/v1/medical-records", json=record_data, headers=doctor_headers
    )
    assert record_res.status_code == 201
    medical_record = record_res.json()
    record_id = medical_record["id"]
    assert medical_record["diagnosis"] == "Acute Bronchitis"

    # Doctor creates digital prescription
    prescription_data = {
        "medical_record_id": record_id,
        "medication_name": "Amoxicillin 500mg",
        "dosage": "1 capsule 3 times daily",
        "instructions": "Take after meals for 7 days.",
    }
    rx_res = client.post(
        "/api/v1/prescriptions", json=prescription_data, headers=doctor_headers
    )
    assert rx_res.status_code == 201
    assert rx_res.json()["medication_name"] == "Amoxicillin 500mg"

    # List prescriptions for record
    rx_list_res = client.get(
        f"/api/v1/prescriptions?medical_record_id={record_id}", headers=doctor_headers
    )
    assert rx_list_res.status_code == 200
    assert len(rx_list_res.json()) == 1
