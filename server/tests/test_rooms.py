import pytest
from fastapi.testclient import TestClient
from datetime import date, timedelta
from server.main import app
from server.database import Base, engine, get_db
from sqlalchemy.orm import sessionmaker

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up tables if needed, but SQLite in-memory or file is fine.


def test_create_room():
    room_number = "101-test"
    response = client.post(
        "/api/v1/rooms",
        json={
            "room_number": room_number,
            "room_type": "Single",
            "price_per_night": 100.0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["room_number"] == room_number
    assert data["room_type"] == "Single"
    assert data["price_per_night"] == 100.0
    assert "id" in data


def test_create_duplicate_room():
    room_number = "102-test"
    # Create first
    client.post(
        "/api/v1/rooms",
        json={
            "room_number": room_number,
            "room_type": "Double",
            "price_per_night": 150.0,
        },
    )
    # Create duplicate
    response = client.post(
        "/api/v1/rooms",
        json={
            "room_number": room_number,
            "room_type": "Double",
            "price_per_night": 150.0,
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Room number already exists"


def test_search_rooms_invalid_dates():
    today = date.today()
    yesterday = today - timedelta(days=1)

    # Check-in in the past
    response = client.get(
        f"/api/v1/rooms?check_in_date={yesterday}&check_out_date={today}"
    )
    assert response.status_code == 400
    assert "past" in response.json()["detail"].lower()

    # Check-in after check-out
    response = client.get(
        f"/api/v1/rooms?check_in_date={today + timedelta(days=2)}&check_out_date={today}"
    )
    assert response.status_code == 400
    assert "before" in response.json()["detail"].lower()
