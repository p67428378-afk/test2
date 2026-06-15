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


def test_reservation_flow():
    # 1. Create a room
    room_number = "201-res-test"
    room_response = client.post(
        "/api/v1/rooms",
        json={
            "room_number": room_number,
            "room_type": "Suite",
            "price_per_night": 250.0,
        },
    )
    assert room_response.status_code == 200
    room_id = room_response.json()["id"]

    # 2. Create a reservation
    today = date.today()
    check_in = today + timedelta(days=5)
    check_out = today + timedelta(days=10)

    res_response = client.post(
        "/api/v1/reservations",
        json={
            "check_in_date": str(check_in),
            "check_out_date": str(check_out),
            "estimated_arrival_time": "14:00",
            "guest": {
                "full_name": "John Doe",
                "phone_number": "+1234567890",
                "email_address": "john.doe@example.com",
            },
            "number_of_guests": 2,
            "room_id": room_id,
        },
    )
    assert res_response.status_code == 200
    res_data = res_response.json()
    assert res_data["room_id"] == room_id
    assert res_data["guest"]["full_name"] == "John Doe"
    assert res_data["status"] == "Confirmed"
    res_id = res_data["id"]

    # 3. Try to book the same room for overlapping dates (should fail)
    overlap_response = client.post(
        "/api/v1/reservations",
        json={
            "check_in_date": str(check_in + timedelta(days=2)),
            "check_out_date": str(check_out + timedelta(days=2)),
            "estimated_arrival_time": "15:00",
            "guest": {
                "full_name": "Jane Smith",
                "phone_number": "0987654321",
                "email_address": "jane.smith@example.com",
            },
            "number_of_guests": 1,
            "room_id": room_id,
        },
    )
    assert overlap_response.status_code == 400
    assert "not available" in overlap_response.json()["detail"].lower()

    # 4. Get reservation by ID
    get_response = client.get(f"/api/v1/reservations/{res_id}")
    assert get_response.status_code == 200
    assert get_response.json()["id"] == res_id

    # 5. Update reservation
    update_response = client.put(
        f"/api/v1/reservations/{res_id}",
        json={
            "check_in_date": str(check_in + timedelta(days=1)),
            "check_out_date": str(check_out + timedelta(days=1)),
            "estimated_arrival_time": "16:00",
            "guest": {
                "full_name": "Johnathan Doe",
                "phone_number": "+1234567890",
                "email_address": "john.doe@example.com",
            },
            "number_of_guests": 3,
            "status": "Confirmed",
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["guest"]["full_name"] == "Johnathan Doe"
    assert update_response.json()["number_of_guests"] == 3

    # 6. List reservations
    list_response = client.get("/api/v1/reservations?search=Johnathan")
    assert list_response.status_code == 200
    assert len(list_response.json()) >= 1
    assert list_response.json()[0]["id"] == res_id


def test_invalid_guest_contact():
    # Create a room
    room_number = "202-res-test"
    room_response = client.post(
        "/api/v1/rooms",
        json={
            "room_number": room_number,
            "room_type": "Suite",
            "price_per_night": 250.0,
        },
    )
    room_id = room_response.json()["id"]

    today = date.today()
    check_in = today + timedelta(days=5)
    check_out = today + timedelta(days=10)

    # Invalid email
    res_response = client.post(
        "/api/v1/reservations",
        json={
            "check_in_date": str(check_in),
            "check_out_date": str(check_out),
            "guest": {
                "full_name": "John Doe",
                "phone_number": "+1234567890",
                "email_address": "invalid-email",
            },
            "room_id": room_id,
        },
    )
    assert res_response.status_code == 422

    # Invalid phone
    res_response = client.post(
        "/api/v1/reservations",
        json={
            "check_in_date": str(check_in),
            "check_out_date": str(check_out),
            "guest": {
                "full_name": "John Doe",
                "phone_number": "invalid-phone-123-abc",
                "email_address": "john.doe@example.com",
            },
            "room_id": room_id,
        },
    )
    assert res_response.status_code == 422
