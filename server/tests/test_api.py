from datetime import datetime, timezone, timedelta


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_auth_login_and_me(client):
    # Test login with seeded user
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    token = data["access_token"]

    # Test me endpoint
    me_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "test@example.com"


def test_auth_register(client):
    user_payload = {
        "email": "newuser@example.com",
        "password": "securepassword",
        "full_name": "New Owner",
        "role": "owner",
    }
    response = client.post("/api/v1/auth/register", json=user_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New Owner"


def test_pets_crud(client):
    # Login first
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Pet
    pet_payload = {
        "name": "Bella",
        "species": "dog",
        "breed": "Golden Retriever",
        "age": 3,
        "weight": 28.5,
        "gender": "female",
        "microchip_number": "985141000999999",
    }
    create_resp = client.post("/api/v1/pets", json=pet_payload, headers=headers)
    assert create_resp.status_code == 201
    pet = create_resp.json()
    pet_id = pet["id"]
    assert pet["name"] == "Bella"

    # List Pets
    list_resp = client.get("/api/v1/pets")
    assert list_resp.status_code == 200
    pets = list_resp.json()
    assert any(p["id"] == pet_id for p in pets)

    # Get Single Pet
    get_resp = client.get(f"/api/v1/pets/{pet_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Bella"

    # Update Pet
    update_payload = {"name": "Bella Swan", "weight": 29.0}
    up_resp = client.put(f"/api/v1/pets/{pet_id}", json=update_payload)
    assert up_resp.status_code == 200
    assert up_resp.json()["name"] == "Bella Swan"
    assert up_resp.json()["weight"] == 29.0


def test_appointments_workflow(client):
    # Create pet first
    create_pet_resp = client.post(
        "/api/v1/pets",
        json={"name": "Max", "species": "cat", "gender": "male"},
    )
    assert create_pet_resp.status_code == 201
    pet_id = create_pet_resp.json()["id"]

    # Book Appointment
    appt_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    appt_payload = {
        "pet_id": pet_id,
        "appointment_date": appt_time,
        "reason": "Annual checkup",
        "notes": "Healthy cat",
    }
    appt_resp = client.post("/api/v1/appointments", json=appt_payload)
    assert appt_resp.status_code == 201
    appt = appt_resp.json()
    appt_id = appt["id"]
    assert appt["status"] == "SCHEDULED"

    # List appointments
    list_resp = client.get("/api/v1/appointments")
    assert list_resp.status_code == 200
    assert any(a["id"] == appt_id for a in list_resp.json())

    # Update status
    status_resp = client.put(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "COMPLETED"},
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "COMPLETED"


def test_medical_records_and_vaccinations(client):
    # Create pet
    create_pet_resp = client.post(
        "/api/v1/pets",
        json={"name": "Rocky", "species": "dog", "gender": "male"},
    )
    pet_id = create_pet_resp.json()["id"]

    # Log Medical Record
    record_payload = {
        "pet_id": pet_id,
        "diagnosis": "Ear infection",
        "treatment": "Ear drop treatment",
        "prescriptions": "Antibiotic drops",
        "notes": "Recheck in 1 week",
    }
    rec_resp = client.post("/api/v1/medical-records", json=record_payload)
    assert rec_resp.status_code == 201
    rec = rec_resp.json()
    assert rec["diagnosis"] == "Ear infection"

    # Get records for pet
    pet_records_resp = client.get(f"/api/v1/pets/{pet_id}/medical-records")
    assert pet_records_resp.status_code == 200
    assert len(pet_records_resp.json()) >= 1

    # Record Vaccination
    now = datetime.now(timezone.utc)
    vax_payload = {
        "pet_id": pet_id,
        "vaccine_name": "Rabies 1-Year",
        "administered_date": now.isoformat(),
        "next_due_date": (now + timedelta(days=365)).isoformat(),
        "status": "UP_TO_DATE",
    }
    vax_resp = client.post("/api/v1/vaccinations", json=vax_payload)
    assert vax_resp.status_code == 201
    vax = vax_resp.json()
    assert vax["vaccine_name"] == "Rabies 1-Year"

    # Get vaccinations for pet
    pet_vax_resp = client.get(f"/api/v1/pets/{pet_id}/vaccinations")
    assert pet_vax_resp.status_code == 200
    assert len(pet_vax_resp.json()) >= 1

    # Check Reminders list and process
    rem_resp = client.get("/api/v1/reminders")
    assert rem_resp.status_code == 200
    assert len(rem_resp.json()) >= 1

    proc_resp = client.post("/api/v1/reminders/process")
    assert proc_resp.status_code == 200
    assert proc_resp.json()["processed_count"] >= 1
