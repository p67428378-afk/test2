def test_create_patient(client, staff_headers):
    payload = {
        "full_name": "Alice Smith",
        "date_of_birth": "1990-07-15",
        "gender": "Female",
        "phone": "+1-555-8899",
        "emergency_contact": "Bob Smith (+1-555-8800)",
        "medical_history": "Penicillin allergy, Asthma",
        "insurance_provider": "Aetna Health",
        "insurance_policy_number": "AET-77192",
    }
    response = client.post("/api/v1/patients", json=payload, headers=staff_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Alice Smith"
    assert data["phone"] == "+1-555-8899"
    assert "id" in data
    assert data["insurance_provider"] == "Aetna Health"


def test_list_patients(client, staff_headers):
    response = client.get("/api/v1/patients", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_search_patients_by_name(client, staff_headers):
    response = client.get("/api/v1/patients?search=Alice", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for p in data:
        assert "alice" in p["full_name"].lower() or "alice" in p["phone"].lower()


def test_get_patient_by_id(client, staff_headers):
    # First list to get an ID
    list_res = client.get("/api/v1/patients", headers=staff_headers)
    patient_id = list_res.json()[0]["id"]

    response = client.get(f"/api/v1/patients/{patient_id}", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == patient_id


def test_update_patient(client, staff_headers):
    list_res = client.get("/api/v1/patients", headers=staff_headers)
    patient_id = list_res.json()[0]["id"]

    update_payload = {
        "medical_history": "Updated medical history: seasonal allergies added.",
        "emergency_contact": "Contact Updated (+1-555-9999)",
    }
    response = client.put(
        f"/api/v1/patients/{patient_id}", json=update_payload, headers=staff_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert (
        data["medical_history"] == "Updated medical history: seasonal allergies added."
    )
    assert data["emergency_contact"] == "Contact Updated (+1-555-9999)"


def test_create_patient_unauthorized_patient_role(client, patient_headers):
    payload = {
        "full_name": "Unauthorized Patient",
        "date_of_birth": "1995-01-01",
        "gender": "Other",
        "phone": "+1-555-0000",
        "emergency_contact": "None",
    }
    response = client.post("/api/v1/patients", json=payload, headers=patient_headers)
    assert response.status_code == 403
