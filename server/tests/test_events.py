# server/tests/test_events.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base
from server.main import app
from datetime import datetime
from server import models

# Use a file-based SQLite database for tests to avoid in-memory isolation issues
TEST_DB_FILE = "test_run.db"
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


def test_read_root():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {
            "message": "Welcome to the Community Event Platform API"
        }


def test_create_and_list_events(db):
    # Seed an event directly
    event = models.Event(
        title="Summer Concert",
        description="Outdoor music concert",
        date_time=datetime.utcnow(),
        location="Amphitheater",
        category="Music",
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    with TestClient(app) as client:
        response = client.get("/api/v1/events")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Summer Concert"

        # Test search
        response = client.get("/api/v1/events?search=Summer")
        assert len(response.json()) == 1

        response = client.get("/api/v1/events?search=Winter")
        assert len(response.json()) == 0


def test_register_for_event(db):
    event = models.Event(
        title="Summer Concert 2",
        description="Outdoor music concert",
        date_time=datetime.utcnow(),
        location="Amphitheater",
        category="Music",
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    with TestClient(app) as client:
        reg_data = {
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "agree_reminders": True,
        }
        response = client.post(f"/api/v1/events/{event.id}/register", json=reg_data)
        assert response.status_code == 200
        assert response.json()["email"] == "john@example.com"

        # Duplicate registration should fail
        response = client.post(f"/api/v1/events/{event.id}/register", json=reg_data)
        assert response.status_code == 400
