# server/tests/test_admin.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base
from server.main import app
import hashlib
from server import models

# Use a file-based SQLite database for tests to avoid in-memory isolation issues
TEST_DB_FILE = "test_run_admin.db"
engine = create_engine(
    f"sqlite:///{TEST_DB_FILE}", connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Explicitly import models to ensure they are registered on Base
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    # Dispose engine to release file locks on Windows
    engine.dispose()
    import os

    try:
        if os.path.exists(TEST_DB_FILE):
            os.remove(TEST_DB_FILE)
    except Exception:
        pass


@pytest.fixture(scope="function")
def db():
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


@pytest.fixture(autouse=True)
def override_db(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    # Override both possible import paths to be absolutely sure
    from server.database import get_db as db_get_db
    from server.routers import events, admin

    app.dependency_overrides[db_get_db] = override_get_db
    app.dependency_overrides[events.database.get_db] = override_get_db
    app.dependency_overrides[admin.database.get_db] = override_get_db

    # Also override the non-package import paths if imported as 'database'
    try:
        import database as raw_database

        app.dependency_overrides[raw_database.get_db] = override_get_db
    except ImportError:
        pass

    yield
    app.dependency_overrides.clear()


def test_admin_login_and_crud(db):
    # Seed admin
    hashed_pw = hashlib.sha256("adminpassword".encode("utf-8")).hexdigest()
    admin = models.Administrator(username="admin", hashed_password=hashed_pw)
    db.add(admin)
    db.commit()

    with TestClient(app) as client:
        # Login
        login_response = client.post(
            "/api/v1/admin/login",
            json={"username": "admin", "password": "adminpassword"},
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create Event
        event_data = {
            "title": "Art Workshop",
            "description": "Learn painting",
            "date_time": "2026-08-01T10:00:00",
            "location": "Community Center",
            "category": "Workshop",
        }
        create_response = client.post(
            "/api/v1/admin/events", json=event_data, headers=headers
        )
        assert create_response.status_code == 201
        event_id = create_response.json()["id"]

        # Update Event
        update_data = {"title": "Advanced Art Workshop"}
        update_response = client.put(
            f"/api/v1/admin/events/{event_id}", json=update_data, headers=headers
        )
        assert update_response.status_code == 200
        assert update_response.json()["title"] == "Advanced Art Workshop"

        # Get Analytics
        report_response = client.get("/api/v1/admin/reports", headers=headers)
        assert report_response.status_code == 200
        assert report_response.json()["total_events"] == 1
