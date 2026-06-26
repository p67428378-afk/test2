def test_register_patient(client):
    # AC: Patient Registration: Allow front-desk staff to register new patients via POST /api/v1/patients
    response = client.post(
        "/api/v1/patients",
        json={
            "name": "John Doe",
            "date_of_birth": "1990-01-01",
            "gender": "Male",
            "phone": "555-0100",
            "email": "john.doe@example.com",
            "address": "123 Main St",
            "insurance_provider": "HealthCare Inc",
            "insurance_policy_number": "POL12345",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert "id" in data


def test_list_patients(client):
    # AC: Patient Registration: Retrieve a list of registered patients with optional search and pagination
    client.post(
        "/api/v1/patients",
        json={
            "name": "Alice Smith",
            "date_of_birth": "1985-05-12",
            "gender": "Female",
            "phone": "555-0101",
            "email": "alice@example.com",
        },
    )
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(p["name"] == "Alice Smith" for p in data)


def test_get_patient_by_id(client):
    # AC: Patient Registration: Retrieve detailed information for a specific patient
    reg_response = client.post(
        "/api/v1/patients",
        json={"name": "Bob Jones", "date_of_birth": "1978-11-23", "gender": "Male"},
    )
    patient_id = reg_response.json()["id"]

    response = client.get(f"/api/v1/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Bob Jones"


def test_get_patient_not_found(client):
    # AC: Patient Registration: Retrieve detailed information for a specific patient (failure case)
    response = client.get("/api/v1/patients/non-existent-id")
    assert response.status_code == 404


def test_update_patient(client):
    # AC: Patient Registration: Allow front-desk staff to manage existing patient information via PUT /api/v1/patients/{id}
    reg_response = client.post(
        "/api/v1/patients",
        json={"name": "Bob Jones", "date_of_birth": "1978-11-23", "gender": "Male"},
    )
    patient_id = reg_response.json()["id"]

    response = client.put(
        f"/api/v1/patients/{patient_id}",
        json={"name": "Bob Jones Updated", "phone": "555-9999"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Bob Jones Updated"
    assert response.json()["phone"] == "555-9999"
