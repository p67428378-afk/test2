from datetime import datetime, timedelta


def test_create_and_list_doctor_slots(client, doctor_headers, db_session):
    from server.models import User

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()

    start = datetime.utcnow() + timedelta(days=5, hours=10)
    end = start + timedelta(minutes=30)
    payload = {
        "doctor_id": doctor.id,
        "department": "Neurology",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
    }
    response = client.post(
        "/api/v1/doctors/slots", json=payload, headers=doctor_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["department"] == "Neurology"
    assert data["is_booked"] is False
    slot_id = data["id"]

    # List slots by department
    list_res = client.get("/api/v1/doctors/slots?department=Neurology")
    assert list_res.status_code == 200
    slots = list_res.json()
    assert any(s["id"] == slot_id for s in slots)


def test_book_appointment_and_prevent_double_booking(
    client, staff_headers, patient_headers, db_session
):
    from server.models import User, Patient

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    patient = db_session.query(Patient).first()

    # 1. Create a dedicated slot
    start = datetime.utcnow() + timedelta(days=6, hours=14)
    end = start + timedelta(minutes=30)
    slot_payload = {
        "doctor_id": doctor.id,
        "department": "General Medicine",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
    }
    slot_res = client.post(
        "/api/v1/doctors/slots", json=slot_payload, headers=staff_headers
    )
    assert slot_res.status_code == 201
    slot_id = slot_res.json()["id"]

    # 2. Book appointment
    booking_payload = {
        "patient_id": patient.id,
        "doctor_id": doctor.id,
        "slot_id": slot_id,
        "reason_for_visit": "Annual checkup and blood pressure review",
    }
    book_res = client.post(
        "/api/v1/appointments", json=booking_payload, headers=patient_headers
    )
    assert book_res.status_code == 201
    apt_data = book_res.json()
    assert apt_data["status"] == "Scheduled"
    assert apt_data["slot_id"] == slot_id
    apt_id = apt_data["id"]

    # 3. Attempt double booking on same slot -> must fail with 409
    double_book_res = client.post(
        "/api/v1/appointments", json=booking_payload, headers=patient_headers
    )
    assert double_book_res.status_code == 409
    assert "already booked" in double_book_res.json()["detail"].lower()

    # 4. Update status to In-Progress then Completed
    status_res = client.patch(
        f"/api/v1/appointments/{apt_id}/status",
        json={"status": "In-Progress"},
        headers=staff_headers,
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "In-Progress"

    status_res2 = client.patch(
        f"/api/v1/appointments/{apt_id}/status",
        json={"status": "Completed"},
        headers=staff_headers,
    )
    assert status_res2.status_code == 200
    assert status_res2.json()["status"] == "Completed"


def test_cancel_appointment_frees_slot(
    client, staff_headers, patient_headers, db_session
):
    from server.models import User, Patient

    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    patient = db_session.query(Patient).first()

    start = datetime.utcnow() + timedelta(days=7, hours=11)
    end = start + timedelta(minutes=30)
    slot_res = client.post(
        "/api/v1/doctors/slots",
        json={
            "doctor_id": doctor.id,
            "department": "Orthopedics",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
        },
        headers=staff_headers,
    )
    assert slot_res.status_code == 201
    slot_id = slot_res.json()["id"]

    # Book
    book_res = client.post(
        "/api/v1/appointments",
        json={
            "patient_id": patient.id,
            "doctor_id": doctor.id,
            "slot_id": slot_id,
            "reason_for_visit": "Knee pain",
        },
        headers=patient_headers,
    )
    assert book_res.status_code == 201
    apt_id = book_res.json()["id"]

    # Cancel
    cancel_res = client.patch(
        f"/api/v1/appointments/{apt_id}/status",
        json={"status": "Cancelled"},
        headers=staff_headers,
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "Cancelled"

    # Verify slot is no longer booked
    slot_check = client.get(f"/api/v1/doctors/{doctor.id}/slots")
    matching_slot = next((s for s in slot_check.json() if s["id"] == slot_id), None)
    assert matching_slot is not None
    assert matching_slot["is_booked"] is False
