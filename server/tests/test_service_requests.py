import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server.models import User, SolarSystem, Alert, ServiceRequest
from server.auth import get_password_hash

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_service_requests.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def tech_headers(client, db):
    # Create a technician user
    tech = User(
        email="tech_sr@example.com",
        name="Service Tech",
        role="technician",
        password_hash=get_password_hash("password123"),
    )
    db.add(tech)
    db.commit()
    db.refresh(tech)

    # Login to get token
    response = client.post(
        "/api/v1/auth/token",
        json={"username": "tech_sr@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, tech


@pytest.fixture(scope="module")
def owner_headers(client, db):
    # Create an owner user
    owner = User(
        email="owner_sr@example.com",
        name="Owner SR",
        role="owner",
        password_hash=get_password_hash("password123"),
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)

    # Login to get token
    response = client.post(
        "/api/v1/auth/token",
        json={"username": "owner_sr@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, owner


def test_get_service_requests_as_technician(client, db, tech_headers, owner_headers):
    headers, tech = tech_headers
    _, owner = owner_headers

    # Create a solar system for the owner
    system = SolarSystem(user_id=owner.id, name="SR System", status="Offline")
    db.add(system)
    db.commit()
    db.refresh(system)

    # Add a critical alert
    alert = Alert(
        system_id=system.id,
        severity="Critical",
        description="Inverter offline",
        is_resolved=False,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Add a service request
    sr = ServiceRequest(alert_id=alert.id, status="New", notes="Urgent repair needed")
    db.add(sr)
    db.commit()
    db.refresh(sr)

    # Test GET service requests as technician
    response = client.get("/api/v1/service-requests", headers=headers)
    assert response.status_code == 200
    requests = response.json()
    assert len(requests) >= 1
    assert requests[0]["id"] == str(sr.id)
    assert requests[0]["customer_name"] == "Owner SR"
    assert requests[0]["alert_details"] == "Inverter offline"
    assert requests[0]["status"] == "New"


def test_get_service_requests_as_owner_forbidden(client, owner_headers):
    headers, _ = owner_headers
    response = client.get("/api/v1/service-requests", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "User is not a technician"


def test_update_service_request(client, db, tech_headers):
    headers, tech = tech_headers

    # Find the service request we created
    sr = db.query(ServiceRequest).first()
    assert sr is not None

    # Update status to In Progress
    update_payload = {"status": "In Progress", "notes": "Technician is on the way"}
    response = client.put(
        f"/api/v1/service-requests/{sr.id}", json=update_payload, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(sr.id)
    assert data["status"] == "In Progress"
    assert data["notes"] == "Technician is on the way"
