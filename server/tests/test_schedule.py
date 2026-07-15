import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.database import Base, get_db
from server.main import app

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_schedule.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_create_schedule_slot():
    response = client.post(
        "/api/v1/schedule",
        json={
            "title": "CS101 Lecture",
            "day_of_week": "Monday",
            "start_time": "09:00:00",
            "end_time": "10:30:00",
            "notes": "Tech Hall Room 402",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "CS101 Lecture"
    assert data["day_of_week"] == "Monday"
    assert data["start_time"] == "09:00:00"
    assert data["end_time"] == "10:30:00"
    assert data["notes"] == "Tech Hall Room 402"
    assert "id" in data


def test_create_schedule_slot_invalid_time():
    response = client.post(
        "/api/v1/schedule",
        json={
            "title": "CS101 Lecture",
            "day_of_week": "Monday",
            "start_time": "11:00:00",
            "end_time": "10:30:00",
            "notes": "Invalid time slot",
        },
    )
    assert response.status_code == 422


def test_get_schedule_slots():
    # Create two slots
    client.post(
        "/api/v1/schedule",
        json={
            "title": "Slot 2",
            "day_of_week": "Tuesday",
            "start_time": "14:00:00",
            "end_time": "15:00:00",
        },
    )
    client.post(
        "/api/v1/schedule",
        json={
            "title": "Slot 1",
            "day_of_week": "Monday",
            "start_time": "09:00:00",
            "end_time": "10:00:00",
        },
    )

    response = client.get("/api/v1/schedule")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # Verify chronological sorting (Monday before Tuesday)
    assert data[0]["title"] == "Slot 1"
    assert data[1]["title"] == "Slot 2"


def test_update_schedule_slot():
    create_response = client.post(
        "/api/v1/schedule",
        json={
            "title": "Original Title",
            "day_of_week": "Wednesday",
            "start_time": "10:00:00",
            "end_time": "11:00:00",
        },
    )
    slot_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/v1/schedule/{slot_id}",
        json={
            "title": "Updated Title",
            "day_of_week": "Thursday",
            "start_time": "11:00:00",
            "end_time": "12:00:00",
            "notes": "Updated notes",
        },
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated Title"
    assert data["day_of_week"] == "Thursday"
    assert data["start_time"] == "11:00:00"
    assert data["end_time"] == "12:00:00"
    assert data["notes"] == "Updated notes"


def test_delete_schedule_slot():
    create_response = client.post(
        "/api/v1/schedule",
        json={
            "title": "To Delete",
            "day_of_week": "Friday",
            "start_time": "15:00:00",
            "end_time": "16:00:00",
        },
    )
    slot_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/v1/schedule/{slot_id}")
    assert delete_response.status_code == 204

    get_response = client.get("/api/v1/schedule")
    assert len(get_response.json()) == 0
