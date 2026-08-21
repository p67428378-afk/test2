def test_create_and_get_patient(client, receptionist_headers):
    patient_data = {
        "ssn_gov_id": "SSN-111-22-3333",
        "first_name": "Alice",
        "last_name": "Smith",
        "dob": "1985-10-20",
        "gender": "Female",
        "phone": "555-0100",
        "emergency_contact": "555-0101",
        "medical_history": "Hypertension",
    }
    # Create patient
    response = client.post(
        "/api/v1/patients", json=patient_data, headers=receptionist_headers
    )
    assert response.status_code == 201
    created_patient = response.json()
    assert created_patient["ssn_gov_id"] == "SSN-111-22-3333"
    patient_id = created_patient["id"]

    # Duplicate SSN conflict
    dup_response = client.post(
        "/api/v1/patients", json=patient_data, headers=receptionist_headers
    )
    assert dup_response.status_code == 409

    # Get patient by ID
    get_response = client.get(
        f"/api/v1/patients/{patient_id}", headers=receptionist_headers
    )
    assert get_response.status_code == 200
    assert get_response.json()["first_name"] == "Alice"

    # Search patients
    search_response = client.get(
        "/api/v1/patients?search=Alice", headers=receptionist_headers
    )
    assert search_response.status_code == 200
    assert len(search_response.json()) >= 1


def test_update_patient(client, receptionist_headers):
    # Fetch seeded sample patient
    list_res = client.get("/api/v1/patients?search=Jane", headers=receptionist_headers)
    assert list_res.status_code == 200
    patients = list_res.json()
    assert len(patients) > 0
    patient_id = patients[0]["id"]

    update_res = client.put(
        f"/api/v1/patients/{patient_id}",
        json={"phone": "555-9999", "medical_history": "Updated history notes"},
        headers=receptionist_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["phone"] == "555-9999"
