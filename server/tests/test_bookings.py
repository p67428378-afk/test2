from datetime import datetime, timedelta
from server import models


def test_create_booking_success(client):
    booking_date = (datetime.utcnow() + timedelta(days=5)).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )
    payload = {
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_phone": "123-456-7890",
        "session_type": "Weddings",
        "booking_date": booking_date,
    }
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["client_name"] == "John Doe"
    assert data["client_email"] == "john@example.com"
    assert data["status"] == "pending"
    assert "id" in data


def test_create_booking_past_date(client):
    booking_date = (datetime.utcnow() - timedelta(days=1)).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )
    payload = {
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_phone": "123-456-7890",
        "session_type": "Weddings",
        "booking_date": booking_date,
    }
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 400
    assert "must be in the future" in response.json()["detail"]


def test_create_booking_duplicate_datetime(client, db):
    booking_date_str = (datetime.utcnow() + timedelta(days=5)).replace(
        microsecond=0
    ).isoformat() + "Z"
    booking_date = datetime.utcnow() + timedelta(days=5)
    booking_date = booking_date.replace(microsecond=0)

    # Seed an existing booking
    existing_booking = models.Booking(
        client_name="Jane Smith",
        client_email="jane@example.com",
        session_type="Portraits",
        booking_date=booking_date,
        status="pending",
    )
    db.add(existing_booking)
    db.commit()

    payload = {
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_phone": "123-456-7890",
        "session_type": "Weddings",
        "booking_date": booking_date_str,
    }
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 400
    assert "already booked" in response.json()["detail"]


def test_get_availability(client, db):
    booking_date = datetime.utcnow() + timedelta(days=5)
    booking_date = booking_date.replace(microsecond=0)

    # Seed a booking
    existing_booking = models.Booking(
        client_name="Jane Smith",
        client_email="jane@example.com",
        session_type="Portraits",
        booking_date=booking_date,
        status="pending",
    )
    db.add(existing_booking)
    db.commit()

    start_date = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
    end_date = (datetime.utcnow() + timedelta(days=10)).strftime("%Y-%m-%d")

    response = client.get(
        f"/api/v1/bookings/availability?start_date={start_date}&end_date={end_date}"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0].startswith(booking_date.isoformat()[:19])


def test_get_availability_invalid_range(client):
    response = client.get(
        "/api/v1/bookings/availability?start_date=2026-06-30&end_date=2026-06-01"
    )
    assert response.status_code == 400
    assert "Invalid date range" in response.json()["detail"]


def test_process_payment_success(client, db):
    booking_date = datetime.utcnow() + timedelta(days=5)
    booking = models.Booking(
        client_name="John Doe",
        client_email="john@example.com",
        session_type="Weddings",
        booking_date=booking_date,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    payload = {"payment_method_id": "pm_card_visa"}
    response = client.post(f"/api/v1/bookings/{booking.id}/pay", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "paid"
    assert "Payment processed successfully" in data["message"]

    # Verify status updated in DB
    db.refresh(booking)
    assert booking.status == "paid"
    assert booking.payment_intent_id == "pi_mock_pm_card_visa"


def test_process_payment_failure(client, db):
    booking_date = datetime.utcnow() + timedelta(days=5)
    booking = models.Booking(
        client_name="John Doe",
        client_email="john@example.com",
        session_type="Weddings",
        booking_date=booking_date,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    payload = {"payment_method_id": "pm_card_charge_declined"}
    response = client.post(f"/api/v1/bookings/{booking.id}/pay", json=payload)
    assert response.status_code == 400
    assert "Payment failed" in response.json()["detail"]


def test_process_payment_not_found(client):
    payload = {"payment_method_id": "pm_card_visa"}
    response = client.post(
        "/api/v1/bookings/3fa85f64-5717-4562-b3fc-2c963f66afa6/pay", json=payload
    )
    assert response.status_code == 404
    assert "Booking not found" in response.json()["detail"]
