import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_properties.db"
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
def broker_token():
    # Register broker
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "prop_broker@example.com",
            "password": "password123",
            "role": "broker",
            "full_name": "Prop Broker",
            "broker_license": "LIC-999",
        },
    )
    # Login
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "prop_broker@example.com", "password": "password123"},
    )
    return response.json()["access_token"]


def test_create_property_unauthorized():
    response = client.post(
        "/api/v1/properties",
        json={
            "address": "123 Main St",
            "price": 500000,
            "property_type": "House",
            "bedrooms": 3,
            "bathrooms": 2,
        },
    )
    assert response.status_code == 401


def test_create_property_success(broker_token):
    response = client.post(
        "/api/v1/properties",
        json={
            "address": "123 Main St",
            "price": 500000,
            "property_type": "House",
            "bedrooms": 3,
            "bathrooms": 2,
            "description": "Beautiful house",
            "images": ["http://example.com/img1.jpg"],
        },
        headers={"Authorization": f"Bearer {broker_token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["address"] == "123 Main St"
    assert data["price"] == 500000.0
    assert "images" in data
    assert len(data["images"]) == 1


def test_list_properties():
    response = client.get("/api/v1/properties")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_property_detail(broker_token):
    # Create one first
    res = client.post(
        "/api/v1/properties",
        json={
            "address": "456 Oak Ave",
            "price": 750000,
            "property_type": "Condo",
            "bedrooms": 2,
            "bathrooms": 2,
        },
        headers={"Authorization": f"Bearer {broker_token}"},
    )
    prop_id = res.json()["id"]

    response = client.get(f"/api/v1/properties/{prop_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["address"] == "456 Oak Ave"
    assert "broker" in data
    assert data["broker"]["email"] == "prop_broker@example.com"
