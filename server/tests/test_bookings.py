import pytest
from fastapi.testclient import TestClient
from datetime import date
from server.main import app
from server.database import Base, engine, SessionLocal, get_db
from server import models, auth


# Override get_db to use the same SessionLocal as the test
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def auth_headers():
    db = SessionLocal()
    guide = (
        db.query(models.Guide)
        .filter(models.Guide.email == "guide_bookings@example.com")
        .first()
    )
    if not guide:
        guide = models.Guide(
            email="guide_bookings@example.com",
            password_hash=auth.get_password_hash("password123"),
            full_name="Bookings Guide",
        )
        db.add(guide)
        db.commit()
        db.refresh(guide)

    # Create a booking for this guide
    booking = models.Booking(
        guide_id=guide.id,
        client_name="Alice Smith",
        client_email="alice@example.com",
        trek_name="Everest Base Camp",
        start_date=date(2026, 8, 1),
        end_date=date(2026, 8, 14),
        status="pending",
        payment_status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    token = auth.create_access_token(data={"sub": guide.email})
    db.close()

    return {
        "headers": {"Authorization": f"Bearer {token}"},
        "booking_id": str(booking.id),
        "guide_id": str(guide.id),
    }


def test_get_bookings(auth_headers):
    client = TestClient(app)
    response = client.get("/api/v1/bookings", headers=auth_headers["headers"])
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["client_name"] == "Alice Smith"


def test_get_booking_detail(auth_headers):
    client = TestClient(app)
    response = client.get(
        f"/api/v1/bookings/{auth_headers['booking_id']}",
        headers=auth_headers["headers"],
    )
    assert response.status_code == 200
    data = response.json()
    assert data["trek_name"] == "Everest Base Camp"


def test_update_booking_status(auth_headers):
    client = TestClient(app)
    response = client.put(
        f"/api/v1/bookings/{auth_headers['booking_id']}",
        headers=auth_headers["headers"],
        json={"status": "confirmed"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"


def test_send_and_get_messages(auth_headers):
    client = TestClient(app)
    # Send message
    response = client.post(
        f"/api/v1/bookings/{auth_headers['booking_id']}/messages",
        headers=auth_headers["headers"],
        json={"message_body": "Hello Alice, looking forward to the trek!"},
    )
    assert response.status_code == 200
    assert (
        response.json()["message_body"] == "Hello Alice, looking forward to the trek!"
    )

    # Get messages
    response = client.get(
        f"/api/v1/bookings/{auth_headers['booking_id']}/messages",
        headers=auth_headers["headers"],
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["message_body"] == "Hello Alice, looking forward to the trek!"
