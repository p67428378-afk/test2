from datetime import datetime, timedelta


def test_create_and_get_emr_record(
    client, doctor_headers, staff_headers, patient_headers, db_session
):
    from server.models import User, Patient

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    patient = db_session.query(Patient).first()

    # 1. Create slot and appointment
    start = datetime.utcnow() + timedelta(days=8, hours=9)
    end = start + timedelta(minutes=30)
    slot_res = client.post(
        "/api/v1/doctors/slots",
        json={
            "doctor_id": doctor.id,
            "department": "Cardiology",
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
            "reason_for_visit": "Chest tightness",
        },
        headers=staff_headers,
    )
    apt_id = apt_res.json()["id"]

    # 2. Doctor logs EMR record
    emr_payload = {
        "appointment_id": apt_id,
        "patient_id": patient.id,
        "doctor_id": doctor.id,
        "diagnosis": "Stage 1 Essential Hypertension",
        "clinical_notes": "Patient presents with mild palpitations and blood pressure 142/90 mmHg. Recommended low sodium diet.",
        "prescriptions": [
            {
                "medication": "Amlodipine",
                "dosage": "5mg",
                "frequency": "Once daily",
                "duration": "30 days",
            },
            {
                "medication": "Lisinopril",
                "dosage": "10mg",
                "frequency": "Once daily",
                "duration": "30 days",
            },
        ],
        "lab_orders": [
            {"test_name": "Comprehensive Metabolic Panel (CMP)", "urgency": "Routine"},
            {"test_name": "12-Lead Electrocardiogram (ECG)", "urgency": "Immediate"},
        ],
    }
    emr_res = client.post(
        "/api/v1/emr/records", json=emr_payload, headers=doctor_headers
    )
    assert emr_res.status_code == 201
    emr_data = emr_res.json()
    assert emr_data["diagnosis"] == "Stage 1 Essential Hypertension"
    assert len(emr_data["prescriptions"]) == 2
    assert len(emr_data["lab_orders"]) == 2
    emr_id = emr_data["id"]

    # 3. Retrieve EMR history for patient
    hist_res = client.get(f"/api/v1/emr/patients/{patient.id}", headers=doctor_headers)
    assert hist_res.status_code == 200
    assert any(r["id"] == emr_id for r in hist_res.json())

    # 4. Retrieve specific record
    rec_res = client.get(f"/api/v1/emr/records/{emr_id}", headers=staff_headers)
    assert rec_res.status_code == 200
    assert rec_res.json()["diagnosis"] == "Stage 1 Essential Hypertension"


def test_emr_unauthorized_creation(client, patient_headers, db_session):
    from server.models import User, Patient, Appointment

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    patient = db_session.query(Patient).first()
    apt = db_session.query(Appointment).first()

    payload = {
        "appointment_id": apt.id if apt else "some-id",
        "patient_id": patient.id,
        "doctor_id": doctor.id,
        "diagnosis": "Self-diagnosis",
        "clinical_notes": "None",
        "prescriptions": [],
        "lab_orders": [],
    }
    res = client.post("/api/v1/emr/records", json=payload, headers=patient_headers)
    assert res.status_code == 403
