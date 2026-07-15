import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime, timedelta
import pytz

from server import models
from server.database import Base, get_db, engine
from server.main import app

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
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.query(models.Appointment).delete()
    db.query(models.Doctor).delete()
    db.query(models.Patient).delete()
    db.commit()

    # Add doctor
    doctor = models.Doctor(
        id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        name="Dr. Test Smith",
        specialty="Cardiology",
    )
    db.add(doctor)

    # Add patient
    patient = models.Patient(
        id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        name="Test Patient",
        contact_info={"email": "test@example.com"},
        insurance_provider="Blue Cross Blue Shield",
        policy_id="BCBS-12345",
    )
    db.add(patient)
    db.commit()
    db.close()
    yield


def test_reschedule_appointment_success():
    doctor_id = "11111111-1111-1111-1111-111111111111"
    patient_id = "22222222-2222-2222-2222-222222222222"

    # Create an appointment 48 hours in the future
    start_time = (datetime.now(pytz.UTC) + timedelta(days=2)).isoformat()

    response = client.post(
        "/api/v1/appointments",
        json={"doctorId": doctor_id, "patientId": patient_id, "startTime": start_time},
    )
    assert response.status_code == 201
    appt_id = response.json()["id"]

    # Reschedule to 3 days in the future
    new_start = (datetime.now(pytz.UTC) + timedelta(days=3)).replace(
        minute=0, second=0, microsecond=0
    )
    new_end = new_start + timedelta(minutes=30)

    res_response = client.patch(
        f"/api/v1/appointments/{appt_id}/reschedule",
        json={
            "new_start_time": new_start.isoformat(),
            "new_end_time": new_end.isoformat(),
        },
    )
    assert res_response.status_code == 200
    res_data = res_response.json()
    assert res_data["status"] == "rescheduled"
    assert res_data["rescheduled_from_id"] == appt_id
    assert res_data["estimated_copay"] == 25.0


def test_reschedule_appointment_24h_rule():
    doctor_id = "11111111-1111-1111-1111-111111111111"
    patient_id = "22222222-2222-2222-2222-222222222222"

    # Create an appointment 12 hours in the future
    start_time = (datetime.now(pytz.UTC) + timedelta(hours=12)).isoformat()

    response = client.post(
        "/api/v1/appointments",
        json={"doctorId": doctor_id, "patientId": patient_id, "startTime": start_time},
    )
    assert response.status_code == 201
    appt_id = response.json()["id"]

    # Attempt to reschedule
    new_start = (datetime.now(pytz.UTC) + timedelta(days=3)).isoformat()
    new_end = (datetime.now(pytz.UTC) + timedelta(days=3, minutes=30)).isoformat()

    res_response = client.patch(
        f"/api/v1/appointments/{appt_id}/reschedule",
        json={"new_start_time": new_start, "new_end_time": new_end},
    )
    assert res_response.status_code == 409
    assert "24 hours" in res_response.json()["detail"]
