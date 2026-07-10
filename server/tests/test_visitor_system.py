import sys
import server.database

sys.modules["database"] = server.database

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date
import uuid

# Import models first to ensure they are registered with Base metadata
import server.models
from server.database import Base, get_db as server_get_db
from server.main import app
from server.models import User, Visitor, Inmate, Appointment

# Setup SQLite in-memory database for testing
# Use a static pool to share the same in-memory database across connections
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply dependency override globally to both import paths
app.dependency_overrides[server_get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    # Create tables in the test database
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test users
    staff = User(
        id=uuid.uuid4(),
        username="staff_user",
        password_hash="testpassword",
        role="staff",
    )
    security = User(
        id=uuid.uuid4(),
        username="security_user",
        password_hash="testpassword",
        role="security",
    )
    db.add_all([staff, security])
    db.commit()

    yield
    db.close()
    Base.metadata.drop_all(bind=engine)


def test_visitor_registration_and_login():
    # 1. Register Visitor
    reg_payload = {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "visitorpassword",
        "date_of_birth": "1990-01-01",
    }
    response = client.post("/api/v1/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data

    # 2. Login Visitor
    login_payload = {
        "username_or_email": "john@example.com",
        "password": "visitorpassword",
    }
    response = client.post("/api/v1/login", json=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "visitor"


def test_appointment_scheduling_and_approval():
    db = TestingSessionLocal()
    # Create an inmate
    inmate = Inmate(
        id=uuid.uuid4(), full_name="Inmate Smith", inmate_id_number="I-12345"
    )
    db.add(inmate)
    db.commit()
    db.refresh(inmate)

    # Register and login visitor
    reg_payload = {
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "password": "visitorpassword",
        "date_of_birth": "1992-02-02",
    }
    client.post("/api/v1/register", json=reg_payload)

    login_resp = client.post(
        "/api/v1/login",
        json={"username_or_email": "jane@example.com", "password": "visitorpassword"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Request Appointment
    appt_payload = {
        "inmate_id": str(inmate.id),
        "requested_datetime": "2026-08-01T10:00:00",
    }
    response = client.post("/api/v1/appointments", json=appt_payload, headers=headers)
    assert response.status_code == 201
    appt_data = response.json()
    assert appt_data["status"] == "pending"
    appt_id = appt_data["id"]

    # Staff Login
    staff_login = client.post(
        "/api/v1/login",
        json={"username_or_email": "staff_user", "password": "testpassword"},
    )
    staff_token = staff_login.json()["access_token"]
    staff_headers = {"Authorization": f"Bearer {staff_token}"}

    # Approve Appointment
    response = client.put(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "approved"},
        headers=staff_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "approved"
    db.close()


def test_visit_logging_and_history():
    db = TestingSessionLocal()
    # Create inmate and visitor
    inmate = Inmate(
        id=uuid.uuid4(), full_name="Inmate Jones", inmate_id_number="I-67890"
    )
    visitor = Visitor(
        id=uuid.uuid4(),
        full_name="Bob Smith",
        email="bob@example.com",
        password_hash="pass",
        date_of_birth=date(1985, 5, 5),
    )
    db.add_all([inmate, visitor])
    db.commit()

    # Create approved appointment
    appt = Appointment(
        id=uuid.uuid4(),
        visitor_id=visitor.id,
        inmate_id=inmate.id,
        requested_datetime=datetime(2026, 8, 1, 14, 0),
        status="approved",
    )
    db.add(appt)
    db.commit()

    # Security Login
    sec_login = client.post(
        "/api/v1/login",
        json={"username_or_email": "security_user", "password": "testpassword"},
    )
    sec_token = sec_login.json()["access_token"]
    sec_headers = {"Authorization": f"Bearer {sec_token}"}

    # Check-in
    response = client.post(
        "/api/v1/visits/check-in",
        json={"appointment_id": str(appt.id), "notes": "All clear"},
        headers=sec_headers,
    )
    assert response.status_code == 200
    log_data = response.json()
    assert "check_in_time" in log_data
    visit_log_id = log_data["id"]

    # Check-out
    response = client.post(
        "/api/v1/visits/check-out",
        json={"visit_log_id": visit_log_id, "notes": "Completed successfully"},
        headers=sec_headers,
    )
    assert response.status_code == 200
    assert "check_out_time" in response.json()

    # Get Inmate History
    response = client.get(f"/api/v1/inmates/{inmate.id}/history", headers=sec_headers)
    assert response.status_code == 200
    history = response.json()
    assert len(history) == 1
    assert history[0]["visitor_name"] == "Bob Smith"
    db.close()
