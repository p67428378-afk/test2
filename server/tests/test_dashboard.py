import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use a unique SQLite database for this test file to avoid state leakage
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_dashboard_unique.db"
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
def auth_headers():
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "dashbroker",
            "email": "dash@example.com",
            "password": "password123",
        },
    )
    response = client.post(
        "/api/v1/auth/token", data={"username": "dashbroker", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_dashboard(auth_headers):
    # Create Property
    response = client.post(
        "/api/v1/properties",
        json={
            "title": "Dashboard Property",
            "description": "A property to test dashboard.",
            "location": "Austin, TX",
            "price": 600000.00,
            "bedrooms": 3,
            "bathrooms": 2,
        },
        headers=auth_headers,
    )
    prop_id = response.json()["id"]

    # Create Inquiry
    client.post(
        "/api/v1/inquiries",
        json={
            "property_id": prop_id,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "Interested!",
        },
    )

    # Get Dashboard
    response = client.get("/api/v1/brokers/me/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["active_listings_count"] == 1
    assert data["new_inquiries_count"] == 1
    assert len(data["listings"]) == 1
    assert data["listings"][0]["title"] == "Dashboard Property"
    assert data["listings"][0]["inquiries_count"] == 1
