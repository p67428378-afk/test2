import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_messages.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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


@pytest.fixture(scope="module")
def setup_data():
    # Register broker
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "msg_broker@example.com",
            "password": "password123",
            "role": "broker",
            "full_name": "Msg Broker",
            "broker_license": "LIC-MSG",
        },
    )
    broker_login = client.post(
        "/api/v1/auth/token",
        data={"username": "msg_broker@example.com", "password": "password123"},
    )
    broker_token = broker_login.json()["access_token"]
    broker_id = broker_login.json()["user"]["id"]

    # Register buyer
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "msg_buyer@example.com",
            "password": "password123",
            "role": "buyer",
            "full_name": "Msg Buyer",
        },
    )
    buyer_login = client.post(
        "/api/v1/auth/token",
        data={"username": "msg_buyer@example.com", "password": "password123"},
    )
    buyer_token = buyer_login.json()["access_token"]

    # Create property
    prop_res = client.post(
        "/api/v1/properties",
        json={
            "address": "789 Msg St",
            "price": 300000,
            "property_type": "Apartment",
            "bedrooms": 1,
            "bathrooms": 1,
        },
        headers={"Authorization": f"Bearer {broker_token}"},
    )
    property_id = prop_res.json()["id"]

    return {
        "broker_token": broker_token,
        "broker_id": broker_id,
        "buyer_token": buyer_token,
        "property_id": property_id,
    }


def test_send_message_success(setup_data):
    response = client.post(
        "/api/v1/messages",
        json={
            "content": "Hello, I am interested in this property.",
            "property_id": setup_data["property_id"],
            "receiver_id": setup_data["broker_id"],
        },
        headers={"Authorization": f"Bearer {setup_data['buyer_token']}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Hello, I am interested in this property."


def test_list_messages(setup_data):
    response = client.get(
        "/api/v1/messages",
        headers={"Authorization": f"Bearer {setup_data['buyer_token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["property_address"] == "789 Msg St"
