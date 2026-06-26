def test_book_appointment(client):
    # AC: Doctor Appointments: Provide scheduling doctor appointments via POST /api/v1/appointments
    # Create patient and doctor first
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
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_date": "2026-07-01T10:00:00",
            "notes": "Regular checkup",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "scheduled"
    assert data["patient_id"] == patient_id
    assert data["doctor_id"] == doctor_id


def test_book_appointment_conflict(client):
    # AC: Doctor Appointments: Prevent double-booking or appointment conflict
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    # Book first appointment
    client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_date": "2026-07-01T10:00:00",
            "notes": "First appointment",
        },
    )

    # Try to book second appointment at the same time with the same doctor
    response = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_date": "2026-07-01T10:00:00",
            "notes": "Second appointment",
        },
    )
    assert response.status_code == 400
    assert "conflict" in response.json()["detail"].lower()


def test_cancel_appointment(client):
    # AC: Doctor Appointments: Provide canceling doctor appointments via DELETE /api/v1/appointments/{id}
    p_resp = client.post(
        "/api/v1/patients",
        json={"name": "Jane Doe", "date_of_birth": "1995-02-02", "gender": "Female"},
    )
    d_resp = client.post(
        "/api/v1/doctors", json={"name": "Dr. Smith", "specialty": "Cardiology"}
    )
    patient_id = p_resp.json()["id"]
    doctor_id = d_resp.json()["id"]

    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_date": "2026-07-01T11:00:00",
        },
    )
    appt_id = appt_resp.json()["id"]

    response = client.delete(f"/api/v1/appointments/{appt_id}")
    assert response.status_code == 200
    assert "cancelled" in response.json()["message"].lower()
