import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server.models import User, SolarSystem, EnergyData
from server.auth import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_systems.db"
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
        email="owner_sys@example.com",
        name="System Owner",
        role="owner",
        password_hash=get_password_hash("password123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Login to get token
    response = client.post(
        "/api/v1/auth/token",
        json={"username": "owner_sys@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, user


def test_get_realtime_and_analytics(client, db, auth_headers):
    headers, user = auth_headers

    # Create a solar system for this user
    system = SolarSystem(user_id=user.id, name="Test System", status="Online")
    db.add(system)
    db.commit()
    db.refresh(system)

    # Add energy data
    energy = EnergyData(
        system_id=system.id,
        current_power_kw=5.2,
        efficiency_pct=94.5,
        today_generation_kwh=22.1,
    )
    db.add(energy)
    db.commit()

    # Test Realtime Endpoint
    response = client.get(f"/api/v1/systems/{system.id}/realtime", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["system_id"] == str(system.id)
    assert data["current_power_kw"] == 5.2
    assert data["efficiency_pct"] == 94.5
    assert data["today_generation_kwh"] == 22.1
    assert data["status"] == "Online"

    # Test Analytics Endpoint
    response = client.get(
        f"/api/v1/systems/{system.id}/analytics?period=weekly", headers=headers
    )
    assert response.status_code == 200
    analytics = response.json()
    assert analytics["system_id"] == str(system.id)
    assert analytics["period"] == "weekly"
    assert len(analytics["generation_data"]) > 0
    assert "usage_breakdown" in analytics


def test_system_not_found(client, auth_headers):
    headers, _ = auth_headers
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/api/v1/systems/{fake_uuid}/realtime", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "System not found"
