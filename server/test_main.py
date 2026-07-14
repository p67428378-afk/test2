import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
import uuid

# Import models first to register them on Base
from server import models
from server.database import Base, get_db, engine
from server.main import app

# Use the actual database engine configured in server.database
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    # Create tables in the actual database
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    db.query(models.Appointment).delete()
    db.query(models.Doctor).delete()
    db.query(models.Patient).delete()
    db.commit()

    # Add a doctor
    doctor = models.Doctor(
        id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        name="Dr. Test Smith",
        specialty="Cardiology",
    )
    db.add(doctor)

    # Add a patient
    patient = models.Patient(
        id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        name="Test Patient",
        contact_info={"email": "test@example.com"},
    )
    db.add(patient)

    db.commit()
    db.close()
    yield


def test_get_doctors():
    response = client.get("/api/v1/doctors")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Dr. Test Smith"
    assert data[0]["specialty"] == "Cardiology"


def test_get_doctor_availability():
    doctor_id = "11111111-1111-1111-1111-111111111111"
    response = client.get(
        f"/api/v1/doctors/{doctor_id}/availability?start_date=2026-07-15&end_date=2026-07-15"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["doctorId"] == doctor_id
    assert len(data["slots"]) > 0


def test_book_and_cancel_appointment():
    doctor_id = "11111111-1111-1111-1111-111111111111"
    patient_id = "22222222-2222-2222-2222-222222222222"
    start_time = "2026-07-15T10:30:00Z"

    # Book appointment
    response = client.post(
        "/api/v1/appointments",
        json={"doctorId": doctor_id, "patientId": patient_id, "startTime": start_time},
    )
    assert response.status_code == 201
    data = response.json()
    appointment_id = data["id"]
    assert data["status"] == "confirmed"

    # Try to double book
    response_double = client.post(
        "/api/v1/appointments",
        json={"doctorId": doctor_id, "patientId": patient_id, "startTime": start_time},
    )
    assert response_double.status_code == 400

    # Get patient appointments
    response_get = client.get(f"/api/v1/patients/{patient_id}/appointments")
    assert response_get.status_code == 200
    appointments = response_get.json()
    assert len(appointments) == 1
    assert appointments[0]["doctorName"] == "Dr. Test Smith"

    # Cancel appointment
    response_cancel = client.delete(f"/api/v1/appointments/{appointment_id}")
    assert response_cancel.status_code == 204
