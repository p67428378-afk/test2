import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use a unique SQLite database for this test file to avoid state leakage
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_properties_unique.db"
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
            "username": "propbroker",
            "email": "prop@example.com",
            "password": "password123",
        },
    )
    response = client.post(
        "/api/v1/auth/token", data={"username": "propbroker", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_property_crud(auth_headers):
    # Create Property
    response = client.post(
        "/api/v1/properties",
        json={
            "title": "Beautiful Austin Villa",
            "description": "A gorgeous modern villa in Austin, TX.",
            "location": "Austin, TX",
            "price": 850000.00,
            "bedrooms": 4,
            "bathrooms": 3,
            "image_urls": ["https://example.com/image1.jpg"],
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    prop_data = response.json()
    assert prop_data["title"] == "Beautiful Austin Villa"
    assert len(prop_data["images"]) == 1
    prop_id = prop_data["id"]

    # Get Properties (List)
    response = client.get("/api/v1/properties?location=Austin")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Get Single Property
    response = client.get(f"/api/v1/properties/{prop_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Beautiful Austin Villa"

    # Update Property
    response = client.put(
        f"/api/v1/properties/{prop_id}",
        json={"title": "Updated Austin Villa", "price": 900000.00},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Austin Villa"
    assert response.json()["price"] == 900000.00

    # Delete Property
    response = client.delete(f"/api/v1/properties/{prop_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Property deleted successfully"
