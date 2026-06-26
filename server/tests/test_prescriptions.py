def test_create_prescription(client):
    # AC: Pharmacy Management: Create a new prescription linked to a medical record via POST /api/v1/prescriptions
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    rec_resp = client.post(
        "/api/v1/medical_records",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "visit_date": "2026-06-26",
            "symptoms": "Fever",
            "diagnosis": "Common cold",
        },
        headers={"X-Role": "Doctor"},
    )
    record_id = rec_resp.json()["id"]

    med_resp = client.post(
        "/api/v1/medications",
        json={
            "name": "Aspirin",
            "code": "ASP100",
            "description": "Blood thinner",
            "price": 5.50,
            "stock_quantity": 200,
        },
    )
    medication_id = med_resp.json()["id"]

    response = client.post(
        "/api/v1/prescriptions",
        json={
            "medical_record_id": record_id,
            "medication_id": medication_id,
            "dosage": "100mg",
            "frequency": "Once daily",
            "duration": "7 days",
        },
        headers={"X-Role": "Doctor"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["medical_record_id"] == record_id
    assert data["medication_id"] == medication_id


def test_dispense_prescription(client):
    # AC: Pharmacy Management: Manage prescription dispensing and medication stock reduction via POST /api/v1/prescriptions/{id}/dispense
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    rec_resp = client.post(
        "/api/v1/medical_records",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "visit_date": "2026-06-26",
            "symptoms": "Fever",
            "diagnosis": "Common cold",
        },
        headers={"X-Role": "Doctor"},
    )
    record_id = rec_resp.json()["id"]

    med_resp = client.post(
        "/api/v1/medications",
        json={
            "name": "Aspirin",
            "code": "ASP100",
            "description": "Blood thinner",
            "price": 5.50,
            "stock_quantity": 10,
        },
    )
    medication_id = med_resp.json()["id"]

    presc_resp = client.post(
        "/api/v1/prescriptions",
        json={
            "medical_record_id": record_id,
            "medication_id": medication_id,
            "dosage": "100mg",
            "frequency": "Once daily",
            "duration": "7 days",
        },
        headers={"X-Role": "Doctor"},
    )
    prescription_id = presc_resp.json()["id"]

    # Dispense prescription
    response = client.post(
        f"/api/v1/prescriptions/{prescription_id}/dispense",
        headers={"X-Role": "Doctor"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "dispensed"

    # Verify stock quantity is reduced
    med_get_resp = client.get("/api/v1/medications")
    meds = med_get_resp.json()
    aspirin = next(m for m in meds if m["id"] == medication_id)
    assert aspirin["stock_quantity"] == 9
