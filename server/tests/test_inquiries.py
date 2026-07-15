import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use a unique SQLite database for this test file to avoid state leakage
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_inquiries_unique.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Drop and recreate tables to ensure a clean slate
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture
def property_id():
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "inqbroker",
            "email": "inq@example.com",
            "password": "password123",
        },
    )
    response = client.post(
        "/api/v1/auth/token", data={"username": "inqbroker", "password": "password123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Property
    response = client.post(
        "/api/v1/properties",
        json={
            "title": "Inquiry Test Property",
            "description": "A property to test inquiries.",
            "location": "Austin, TX",
            "price": 500000.00,
            "bedrooms": 3,
            "bathrooms": 2,
        },
        headers=headers,
    )
    return response.json()["id"]


def test_create_inquiry(property_id):
    response = client.post(
        "/api/v1/inquiries",
        json={
            "property_id": property_id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I am interested in this property.",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert data["property_id"] == property_id
