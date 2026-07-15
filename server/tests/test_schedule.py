import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.database import Base, get_db
from server.main import app

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
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


def test_create_and_get_schedule_slots(client):
    # Create a schedule slot
    payload = {
        "event_title": "Team Sync",
        "day_of_week": "Monday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "notes_location": "Room 404",
    }
    response = client.post("/api/v1/schedule-slots", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["event_title"] == "Team Sync"
    assert data["day_of_week"] == "Monday"
    assert data["start_time"] == "10:00:00"
    assert data["end_time"] == "11:00:00"
    assert data["notes_location"] == "Room 404"
    assert data["is_completed"] is False
    assert "id" in data

    # Get all schedule slots
    response = client.get("/api/v1/schedule-slots")
    assert response.status_code == 200
    slots = response.json()
    assert len(slots) == 1
    assert slots[0]["event_title"] == "Team Sync"


def test_create_schedule_slot_invalid_time(client):
    # End time earlier than start time
    payload = {
        "event_title": "Invalid Slot",
        "day_of_week": "Monday",
        "start_time": "11:00:00",
        "end_time": "10:00:00",
        "notes_location": "Room 404",
    }
    response = client.post("/api/v1/schedule-slots", json=payload)
    assert response.status_code == 422

    # End time equal to start time
    payload["end_time"] = "11:00:00"
    response = client.post("/api/v1/schedule-slots", json=payload)
    assert response.status_code == 422


def test_create_schedule_slot_invalid_day(client):
    payload = {
        "event_title": "Invalid Day",
        "day_of_week": "Funday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "notes_location": "Room 404",
    }
    response = client.post("/api/v1/schedule-slots", json=payload)
    assert response.status_code == 422


def test_update_schedule_slot(client):
    # Create first
    payload = {
        "event_title": "Team Sync",
        "day_of_week": "Monday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "notes_location": "Room 404",
    }
    create_resp = client.post("/api/v1/schedule-slots", json=payload)
    slot_id = create_resp.json()["id"]

    # Update
    update_payload = {
        "event_title": "Updated Sync",
        "day_of_week": "Tuesday",
        "start_time": "11:00:00",
        "end_time": "12:00:00",
        "notes_location": "Room 505",
    }
    response = client.put(f"/api/v1/schedule-slots/{slot_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["event_title"] == "Updated Sync"
    assert data["day_of_week"] == "Tuesday"
    assert data["start_time"] == "11:00:00"
    assert data["end_time"] == "12:00:00"
    assert data["notes_location"] == "Room 505"


def test_delete_schedule_slot(client):
    # Create first
    payload = {
        "event_title": "Team Sync",
        "day_of_week": "Monday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "notes_location": "Room 404",
    }
    create_resp = client.post("/api/v1/schedule-slots", json=payload)
    slot_id = create_resp.json()["id"]

    # Delete
    response = client.delete(f"/api/v1/schedule-slots/{slot_id}")
    assert response.status_code == 204

    # Verify deleted
    response = client.get("/api/v1/schedule-slots")
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_toggle_completion(client):
    # Create first
    payload = {
        "event_title": "Team Sync",
        "day_of_week": "Monday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "notes_location": "Room 404",
    }
    create_resp = client.post("/api/v1/schedule-slots", json=payload)
    slot_id = create_resp.json()["id"]
    assert create_resp.json()["is_completed"] is False

    # Toggle to True
    response = client.patch(f"/api/v1/schedule-slots/{slot_id}/toggle-completion")
    assert response.status_code == 200
    assert response.json()["is_completed"] is True

    # Toggle back to False
    response = client.patch(f"/api/v1/schedule-slots/{slot_id}/toggle-completion")
    assert response.status_code == 200
    assert response.json()["is_completed"] is False
