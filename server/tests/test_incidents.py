import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.database import Base, get_db
from server.app.main import app
from server.app.models import User, SLA, Incident
from server.app.services.notifications import sent_notifications

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()

    # Seed default SLAs
    default_slas = [
        SLA(priority="High", response_time=15, resolution_time=60),
        SLA(priority="Medium", response_time=30, resolution_time=120),
        SLA(priority="Low", response_time=60, resolution_time=240),
    ]
    db_session.add_all(default_slas)

    # Seed a test user
    test_user = User(
        id="test-user-id", name="Test User", email="test@example.com", role="Engineer"
    )
    db_session.add(test_user)

    db_session.commit()

    yield db_session

    db_session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_create_incident(client):
    # AC: Users must be able to submit new incident reports through a simple and intuitive web form.
    payload = {
        "affected_system": "Database Cluster",
        "description": "Primary database is not responding to queries.",
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "priority": "High",
        "reporter_email": "reporter@example.com",
        "reporter_name": "John Doe",
    }
    response = client.post("/api/v1/incidents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["affected_system"] == "Database Cluster"
    assert data["priority"] == "High"
    assert data["status"] == "Open"
    assert "id" in data
    assert "title" in data


def test_list_incidents(client):
    # AC: Engineers and system administrators must be able to view a dashboard of all reported incidents.
    # Create an incident first
    payload = {
        "affected_system": "Web Server",
        "description": "Nginx returning 502 Bad Gateway.",
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "priority": "Medium",
        "reporter_email": "reporter@example.com",
        "reporter_name": "John Doe",
    }
    client.post("/api/v1/incidents", json=payload)

    response = client.get("/api/v1/incidents")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1
    assert data["items"][0]["affected_system"] == "Web Server"


def test_resolve_incident_generates_rca(client, db):
    # AC: Once an incident is marked as 'Resolved,' the system should automatically generate a draft RCA report.
    # Create incident
    payload = {
        "affected_system": "Auth Service",
        "description": "Users cannot log in.",
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "priority": "High",
        "reporter_email": "reporter@example.com",
        "reporter_name": "John Doe",
    }
    create_resp = client.post("/api/v1/incidents", json=payload)
    incident_id = create_resp.json()["id"]

    # Update status to Resolved
    update_payload = {
        "status": "Resolved",
        "assignee_id": "test-user-id",
        "internal_notes": "Fixed the auth token validation logic.",
    }
    update_resp = client.put(f"/api/v1/incidents/{incident_id}", json=update_payload)
    assert update_resp.status_code == 200

    # Check if RCA report was generated
    rca_resp = client.get(f"/api/v1/incidents/{incident_id}/rca")
    assert rca_resp.status_code == 200
    rca_data = rca_resp.json()
    assert rca_data["incident_id"] == incident_id
    assert "Draft RCA" in rca_data["content"]
    assert len(rca_data["timeline"]) >= 3


def test_sla_breach_tracking(client, db):
    # AC: The system must track the time an incident has been open and compare it against predefined SLAs for different priority levels.
    # Create an incident that was created 2 hours ago (breaching High priority SLA of 1 hour)
    past_time = datetime.now(timezone.utc) - timedelta(hours=2)
    db_incident = Incident(
        title="Old Outage",
        description="Old description",
        status="Open",
        priority="High",
        affected_system="Legacy System",
        reporter_name="Old Reporter",
        reporter_email="old@example.com",
        occurred_at=past_time,
        created_at=past_time,
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)

    # Clear notifications list
    sent_notifications.clear()

    # Trigger SLA check by listing incidents
    response = client.get("/api/v1/incidents")
    assert response.status_code == 200

    # Verify escalation note was added to internal notes
    db.refresh(db_incident)
    assert "[SLA BREACH]" in db_incident.internal_notes

    # Verify email notification was sent to IT manager
    assert len(sent_notifications) >= 1
    manager_email = [
        n for n in sent_notifications if n["to_email"] == "it_manager@example.com"
    ]
    assert len(manager_email) >= 1
    assert "SLA BREACH" in manager_email[0]["subject"]


def test_status_update_notifications(client):
    # AC: Users who report an incident should receive automatic email notifications when the incident status is updated.
    payload = {
        "affected_system": "Email Server",
        "description": "SMTP server is down.",
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "priority": "Medium",
        "reporter_email": "reporter@example.com",
        "reporter_name": "John Doe",
    }
    create_resp = client.post("/api/v1/incidents", json=payload)
    incident_id = create_resp.json()["id"]

    # Clear notifications list
    sent_notifications.clear()

    # Update status to In Progress
    update_payload = {"status": "In Progress"}
    client.put(f"/api/v1/incidents/{incident_id}", json=update_payload)

    # Verify notification was sent to reporter
    assert len(sent_notifications) >= 1
    reporter_notif = [
        n for n in sent_notifications if n["to_email"] == "reporter@example.com"
    ]
    assert len(reporter_notif) >= 1
    assert "Status Updated" in reporter_notif[0]["subject"]
    assert "In Progress" in reporter_notif[0]["body"]
