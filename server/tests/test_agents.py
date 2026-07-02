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
def admin_headers(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "admin",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@example.com", "password": "adminpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def customer_headers(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "customer@example.com",
            "password": "password123",
            "full_name": "Customer User",
            "role": "customer",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "customer@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_add_agent_as_admin(client, admin_headers):
    # AC: Agent Management: Administrators can add, view, and assign delivery agents to shipments.
    response = client.post(
        "/api/v1/admin/agents",
        headers=admin_headers,
        json={"full_name": "John Doe", "phone_number": "123-456-7890"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "John Doe"
    assert data["status"] == "active"


def test_add_agent_as_customer_forbidden(client, customer_headers):
    # AC: Agent Management: Administrators can add, view, and assign delivery agents to shipments.
    response = client.post(
        "/api/v1/admin/agents",
        headers=customer_headers,
        json={"full_name": "John Doe", "phone_number": "123-456-7890"},
    )
    assert response.status_code == 403


def test_list_agents(client, admin_headers):
    # AC: Agent Management: Administrators can add, view, and assign delivery agents to shipments.
    client.post(
        "/api/v1/admin/agents",
        headers=admin_headers,
        json={"full_name": "Agent A", "phone_number": "111"},
    )
    response = client.get("/api/v1/admin/agents", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) >= 1
    assert data["items"][0]["full_name"] == "Agent A"


def test_assign_agent_to_shipment(client, admin_headers, customer_headers):
    # AC: Agent Management: Administrators can add, view, and assign delivery agents to shipments.
    # 1. Create agent
    agent_res = client.post(
        "/api/v1/admin/agents",
        headers=admin_headers,
        json={"full_name": "Agent B", "phone_number": "222"},
    )
    agent_id = agent_res.json()["id"]

    # 2. Create shipment
    shipment_res = client.post(
        "/api/v1/shipments",
        headers=customer_headers,
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
    shipment_id = shipment_res.json()["id"]

    # 3. Assign agent
    assign_res = client.post(
        "/api/v1/admin/shipments/{}/assign".format(shipment_id),
        headers=admin_headers,
        json={"agent_id": agent_id},
    )
    assert assign_res.status_code == 200
    data = assign_res.json()
    assert data["agent_id"] == agent_id
    assert data["status"] == "assigned"


def test_update_shipment_status(client, admin_headers, customer_headers):
    # AC: Notifications: Users receive automated email or SMS notifications for key delivery milestones (e.g., 'Out for Delivery,' 'Delivered').
    # 1. Create shipment
    shipment_res = client.post(
        "/api/v1/shipments",
        headers=customer_headers,
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
    shipment_id = shipment_res.json()["id"]

    # 2. Update status to 'Out for Delivery'
    status_res = client.post(
        "/api/v1/admin/shipments/{}/status".format(shipment_id),
        headers=admin_headers,
        json={
            "status": "Out for Delivery",
            "location": "Local Hub",
            "notes": "Package is out for delivery with agent.",
        },
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "Out for Delivery"
