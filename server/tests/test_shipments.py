import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.database import Base, get_db
from server.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()
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


@pytest.fixture(scope="function")
def auth_headers(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "shipper@example.com",
            "password": "password123",
            "full_name": "Shipper User",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "shipper@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_shipment(client, auth_headers):
    # AC: Shipment Booking: Users can create a new shipment by providing sender and recipient details, package dimensions, and weight.
    response = client.post(
        "/api/v1/shipments",
        headers=auth_headers,
        json={
            "sender_details": {
                "name": "Alice",
                "phone": "1234567890",
                "address": "123 Sender St",
                "city": "New York",
            },
            "recipient_details": {
                "name": "Bob",
                "phone": "0987654321",
                "address": "456 Recipient Rd",
                "city": "Los Angeles",
            },
            "package_details": {
                "weight": 2.5,
                "width": 10.0,
                "height": 5.0,
                "length": 15.0,
                "description": "Books",
            },
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert "tracking_id" in data
    assert data["status"] == "booked"


def test_list_shipments(client, auth_headers):
    # AC: Shipment Booking: Users can create a new shipment by providing sender and recipient details, package dimensions, and weight.
    client.post(
        "/api/v1/shipments",
        headers=auth_headers,
        json={
            "sender_details": {
                "name": "Alice",
                "phone": "123",
                "address": "Addr1",
                "city": "City1",
            },
            "recipient_details": {
                "name": "Bob",
                "phone": "456",
                "address": "Addr2",
                "city": "City2",
            },
            "package_details": {
                "weight": 1.0,
                "width": 1.0,
                "height": 1.0,
                "length": 1.0,
            },
        },
    )
    response = client.get("/api/v1/shipments", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) >= 1
    assert data["items"][0]["recipient_name"] == "Bob"


def test_track_shipment(client, auth_headers):
    # AC: Package Tracking: Users can track a package using a unique tracking ID and view its current location and delivery status.
    res = client.post(
        "/api/v1/shipments",
        headers=auth_headers,
        json={
            "sender_details": {
                "name": "Alice",
                "phone": "123",
                "address": "Addr1",
                "city": "City1",
            },
            "recipient_details": {
                "name": "Bob",
                "phone": "456",
                "address": "Addr2",
                "city": "City2",
            },
            "package_details": {
                "weight": 1.0,
                "width": 1.0,
                "height": 1.0,
                "length": 1.0,
            },
        },
    )
    tracking_id = res.json()["tracking_id"]

    response = client.get(f"/api/v1/shipments/{tracking_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["tracking_id"] == tracking_id
    assert data["sender_name"] == "Alice"
    assert data["recipient_name"] == "Bob"
    assert len(data["tracking_history"]) >= 1
    assert data["tracking_history"][0]["status"] == "booked"
