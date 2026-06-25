import pytest
import uuid
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db
from server import models

# Use DATABASE_URL from env (provided by validation sandbox)
DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


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
    # Clean up tables before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # Seed test user
    db = TestingSessionLocal()
    test_user = models.User(
        id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
        login_id="test@example.com",
        mobile_number="1234567890",
        hashed_password="hashed_testpassword",
        security_question="What is your favorite color?",
        security_answer_hash="blue",
    )
    db.add(test_user)
    db.commit()
    db.close()


def get_auth_headers(user_id: str = "00000000-0000-0000-0000-000000000000"):
    return {"Authorization": f"Bearer {user_id}"}


def test_save_payment_token_success():
    # AC: If the user checks the 'Save this card' box, the frontend client sends card details directly to the payment gateway, receives a secure token, and sends it to the backend to store in the database.
    headers = get_auth_headers()
    response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["card_brand"] == "Visa"
    assert data["card_last_four"] == "4242"
    assert data["card_expiry_date"] == "2028-12-31"
    assert "id" in data
    assert data["user_id"] == "00000000-0000-0000-0000-000000000000"


def test_save_payment_token_unauthorized():
    # AC: Only authenticated users can save cards
    response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
    )
    assert response.status_code == 401


def test_save_payment_token_invalid_data():
    # AC: Invalid request body or token returns 400
    headers = get_auth_headers()
    response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": " ",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    assert response.status_code == 400

    response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "424",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    assert response.status_code == 400


def test_get_saved_cards_success():
    # AC: Users must have a section in their account settings page titled 'Saved Payment Methods' to view and delete saved cards.
    headers = get_auth_headers()
    # First save a card
    client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )

    response = client.get("/api/v1/user/cards", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["card_brand"] == "Visa"
    assert data[0]["card_last_four"] == "4242"


def test_get_saved_cards_unauthorized():
    response = client.get("/api/v1/user/cards")
    assert response.status_code == 401


def test_delete_saved_card_success():
    # AC: Users must have a section in their account settings page titled 'Saved Payment Methods' to view and delete saved cards.
    headers = get_auth_headers()
    # Save a card
    save_response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    card_id = save_response.json()["id"]

    # Delete the card
    delete_response = client.delete(f"/api/v1/user/cards/{card_id}", headers=headers)
    assert delete_response.status_code == 200
    assert delete_response.json() == {
        "message": "Card deleted successfully",
        "success": True,
    }

    # Verify it is deleted
    get_response = client.get("/api/v1/user/cards", headers=headers)
    assert len(get_response.json()) == 0


def test_delete_saved_card_not_found():
    headers = get_auth_headers()
    random_uuid = str(uuid.uuid4())
    response = client.delete(f"/api/v1/user/cards/{random_uuid}", headers=headers)
    assert response.status_code == 404


def test_charge_payment_saved_card_success():
    # AC: Returning users with saved cards can select a saved card to pay, showing the card brand and last four digits. They must still enter their CVV code for security.
    headers = get_auth_headers()
    # Save a card
    save_response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    card_id = save_response.json()["id"]

    # Charge using saved card
    response = client.post(
        "/api/v1/payment/charge",
        json={"amount": 128.50, "card_id": card_id, "currency": "USD", "cvv": "123"},
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "transaction_id" in data


def test_charge_payment_saved_card_invalid_cvv():
    headers = get_auth_headers()
    # Save a card
    save_response = client.post(
        "/api/v1/payment/token",
        json={
            "payment_token": "tok_12345",
            "card_last_four": "4242",
            "card_brand": "Visa",
            "card_expiry_date": "2028-12-31",
        },
        headers=headers,
    )
    card_id = save_response.json()["id"]

    # Charge with invalid CVV
    response = client.post(
        "/api/v1/payment/charge",
        json={"amount": 128.50, "card_id": card_id, "currency": "USD", "cvv": "12"},
        headers=headers,
    )
    assert response.status_code == 400


def test_charge_payment_new_card_success():
    headers = get_auth_headers()
    response = client.post(
        "/api/v1/payment/charge",
        json={
            "amount": 128.50,
            "currency": "USD",
            "cvv": "123",
            "payment_token": "tok_new_card",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "transaction_id" in data
