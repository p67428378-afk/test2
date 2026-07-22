import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta
from server.auth import get_password_hash, create_access_token
from server.models import User, Component, Certification, MaintenanceEvent


@pytest.fixture
def engineer_token(db_session: Session):
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="test@example.com",
        full_name="Elena Rostova",
        role="Engineer",
        hashed_password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()
    return create_access_token({"sub": user.email})


def test_trigger_alerts(client: TestClient, engineer_token: str, db_session: Session):
    # AC: The system sends email alerts to responsible engineers for expired certifications
    # AC: The system sends email alerts for upcoming maintenance and inspection deadlines
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create engineer user
    eng = db_session.query(User).filter(User.email == "test@example.com").first()

    # Create component
    comp = Component(
        name="Thruster Valve",
        location="Bay 4",
        status="Available",
        inventory_count=1,
        responsible_engineer_id=eng.id,
    )
    db_session.add(comp)
    db_session.commit()

    # Add expired certification
    cert = Certification(
        component_id=comp.id,
        name="Flight Readiness Cert",
        issue_date=date.today() - timedelta(days=100),
        expiry_date=date.today() - timedelta(days=1),
    )
    db_session.add(cert)

    # Add upcoming maintenance event (e.g., 30 days from now)
    event = MaintenanceEvent(
        component_id=comp.id,
        event_type="Inspection",
        scheduled_date=date.today() + timedelta(days=30),
    )
    db_session.add(event)
    db_session.commit()

    response = client.post("/api/v1/alerts/trigger?intervals=30", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["alerts_sent"] >= 2
    assert "completed" in data["detail"].lower()
