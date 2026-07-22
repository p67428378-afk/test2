import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta
from server.auth import get_password_hash, create_access_token
from server.models import User, Component, Mission, Certification


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


def test_create_mission(client: TestClient, engineer_token: str):
    # AC: Create a new mission
    headers = {"Authorization": f"Bearer {engineer_token}"}
    payload = {
        "name": "Artemis III",
        "launch_date": str(date.today() + timedelta(days=365)),
        "status": "Planning",
    }
    response = client.post("/api/v1/missions", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Artemis III"


def test_assign_equipment_success(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: I can assign equipment to specific space missions
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
    )
    db_session.add(comp)
    db_session.commit()

    # Add valid certification
    cert = Certification(
        component_id=comp.id,
        name="Flight Readiness Cert",
        issue_date=date.today() - timedelta(days=10),
        expiry_date=date.today() + timedelta(days=100),
    )
    db_session.add(cert)
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    payload = {"component_id": str(comp.id)}
    response = client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["detail"] == "Equipment assigned to mission successfully"

    # Verify component status updated to 'Assigned'
    db_session.refresh(comp)
    assert comp.status == "Assigned"


def test_prevent_assignment_uncertified(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: The system prevents the assignment of uncertified equipment to a mission
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component with NO certifications
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
    )
    db_session.add(comp)
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    payload = {"component_id": str(comp.id)}
    response = client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )
    assert response.status_code == 400
    assert "uncertified" in response.json()["detail"].lower()


def test_prevent_assignment_expired(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: A component cannot be assigned to a mission if its certification is expired
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
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
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    payload = {"component_id": str(comp.id)}
    response = client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )
    assert response.status_code == 400
    assert "expired" in response.json()["detail"].lower()


def test_prevent_assignment_out_of_service(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: A component cannot be assigned to a mission if it is marked as 'out of service'
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component marked as Out of Service
    comp = Component(
        name="Thruster Valve",
        location="Bay 4",
        status="Out of Service",
        inventory_count=1,
    )
    db_session.add(comp)
    db_session.commit()

    # Add valid certification
    cert = Certification(
        component_id=comp.id,
        name="Flight Readiness Cert",
        issue_date=date.today() - timedelta(days=10),
        expiry_date=date.today() + timedelta(days=100),
    )
    db_session.add(cert)
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    payload = {"component_id": str(comp.id)}
    response = client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )
    assert response.status_code == 400
    assert "out of service" in response.json()["detail"].lower()


def test_prevent_assignment_flagged_without_approval(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: Components flagged for engineering review require supervisor approval before being assigned to any mission
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component flagged for review, NOT supervisor approved
    comp = Component(
        name="Thruster Valve",
        location="Bay 4",
        status="Available",
        inventory_count=1,
        flagged_for_review=True,
        supervisor_approved=False,
    )
    db_session.add(comp)
    db_session.commit()

    # Add valid certification
    cert = Certification(
        component_id=comp.id,
        name="Flight Readiness Cert",
        issue_date=date.today() - timedelta(days=10),
        expiry_date=date.today() + timedelta(days=100),
    )
    db_session.add(cert)
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    payload = {"component_id": str(comp.id)}
    response = client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )
    assert response.status_code == 400
    assert "supervisor approval" in response.json()["detail"].lower()


def test_get_mission_equipment(
    client: TestClient, engineer_token: str, db_session: Session
):
    # AC: I can view a list of all equipment assigned to a mission
    headers = {"Authorization": f"Bearer {engineer_token}"}

    # Create component
    comp = Component(
        name="Thruster Valve", location="Bay 4", status="Available", inventory_count=1
    )
    db_session.add(comp)
    db_session.commit()

    # Add valid certification
    cert = Certification(
        component_id=comp.id,
        name="Flight Readiness Cert",
        issue_date=date.today() - timedelta(days=10),
        expiry_date=date.today() + timedelta(days=100),
    )
    db_session.add(cert)
    db_session.commit()

    # Create mission
    mission = Mission(
        name="Artemis III",
        launch_date=date.today() + timedelta(days=365),
        status="Planning",
    )
    db_session.add(mission)
    db_session.commit()

    # Assign
    payload = {"component_id": str(comp.id)}
    client.post(
        f"/api/v1/missions/{mission.id}/equipment", json=payload, headers=headers
    )

    # Get equipment
    response = client.get(f"/api/v1/missions/{mission.id}/equipment")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Thruster Valve"
