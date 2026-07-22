import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta
from server.auth import get_password_hash, create_access_token
from server.models import User, Component, MaintenanceEvent


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


def test_schedule_inspection(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: I can schedule inspections and calibrations for each component
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
    )
    db_session.add(comp)
    db_session.commit()

    payload = {
        "component_id": str(comp.id),
        "event_type": "Inspection",
        "scheduled_date": str(date.today() + timedelta(days=30)),
    }
    response = client.post("/api/v1/inspections", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["event_type"] == "Inspection"
    assert data["scheduled_date"] == str(date.today() + timedelta(days=30))


def test_list_inspections(client: TestClient, db_session: Session):
    # AC: The system records the history of all inspections and calibrations
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
    )
    db_session.add(comp)
    db_session.commit()

    event1 = MaintenanceEvent(
        component_id=comp.id,
        event_type="Inspection",
        scheduled_date=date.today() - timedelta(days=10),
        completion_date=date.today() - timedelta(days=10),
        notes="Passed",
    )
    event2 = MaintenanceEvent(
        component_id=comp.id,
        event_type="Calibration",
        scheduled_date=date.today() + timedelta(days=20),
    )
    db_session.add_all([event1, event2])
    db_session.commit()

    response = client.get("/api/v1/inspections")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["event_type"] in ["Inspection", "Calibration"]
