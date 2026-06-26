def test_create_medical_record(client):
    # AC: Medical Records: Securely store and manage patient medical records via POST /api/v1/medical_records
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    response = client.post(
        "/api/v1/medical_records",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "visit_date": "2026-06-26",
            "symptoms": "Chest pain, shortness of breath",
            "diagnosis": "Mild arrhythmia",
            "treatment_plan": "Rest and follow-up in 2 weeks",
        },
        headers={"X-Role": "Doctor"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["diagnosis"] == "Mild arrhythmia"
    assert "id" in data


def test_create_medical_record_unauthorized(client):
    # AC: Medical Records: Securely store and manage patient medical records (unauthorized case)
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    response = client.post(
        "/api/v1/medical_records",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "visit_date": "2026-06-26",
            "symptoms": "Chest pain",
            "diagnosis": "Mild arrhythmia",
        },
        headers={"X-Role": "Patient"},
    )
    assert response.status_code == 403


def test_get_medical_record(client):
    # AC: Medical Records: Retrieve details of a specific medical record via GET /api/v1/medical_records/{id}
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

    response = client.get(
        f"/api/v1/medical_records/{record_id}", headers={"X-Role": "Doctor"}
    )
    assert response.status_code == 200
    assert response.json()["diagnosis"] == "Common cold"
