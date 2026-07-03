import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server.models import User, SolarSystem, Alert
from server.auth import get_password_hash

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_alerts.db"
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
def auth_headers(client, db):
    # Create a test user
    user = User(
        email="owner_alerts@example.com",
        name="Alerts Owner",
        role="owner",
        password_hash=get_password_hash("password123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Login to get token
    response = client.post(
        "/api/v1/auth/token",
        json={"username": "owner_alerts@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, user


def test_get_alerts(client, db, auth_headers):
    headers, user = auth_headers

    # Create a solar system for this user
    system = SolarSystem(user_id=user.id, name="Alerts System", status="Degraded")
    db.add(system)
    db.commit()
    db.refresh(system)

    # Add an alert
    alert = Alert(
        system_id=system.id,
        severity="Medium",
        description="Panel efficiency dropped below 80%",
        is_resolved=False,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Test Alerts Endpoint
    response = client.get("/api/v1/alerts", headers=headers)
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) == 1
    assert alerts[0]["id"] == str(alert.id)
    assert alerts[0]["severity"] == "Medium"
    assert alerts[0]["description"] == "Panel efficiency dropped below 80%"
    assert alerts[0]["is_resolved"] is False
