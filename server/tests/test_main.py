import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

# Import models first to register them on Base.metadata!
from server import models
from server.database import Base, get_db, engine
from server.main import app

# Use the same engine as the application!
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True, scope="function")
def setup_db():
    # Create tables in the test database
    Base.metadata.create_all(bind=engine)

    # Seed a test property
    db = TestingSessionLocal()
    test_property = models.Property(
        id=uuid4(),
        title="Test Villa",
        location="Austin, TX",
        price=500000.00,
        bedrooms=4,
        bathrooms=3.0,
        description="A beautiful test villa",
    )
    test_property.image_urls = ["https://example.com/image1.jpg"]
    db.add(test_property)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


# Use a fixture for the client to ensure it is created after dependency overrides and DB setup
@pytest.fixture(scope="function")
def client():
    with TestClient(app) as c:
        yield c


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to HavenBroker API"}


def test_search_properties_no_filter(client):
    # Let's query the DB directly to see if the table exists and has data
    db = TestingSessionLocal()
    props = db.query(models.Property).all()
    print(f"DIRECT DB QUERY: {len(props)} properties found")
    db.close()

    response = client.get("/api/v1/properties")
    print(f"API RESPONSE STATUS: {response.status_code}")
    print(f"API RESPONSE TEXT: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    # Find the test villa in the returned list
    test_villa = next((p for p in data if p["title"] == "Test Villa"), None)
    assert test_villa is not None
    assert test_villa["location"] == "Austin, TX"


def test_search_properties_with_filter(client):
    response = client.get("/api/v1/properties?location=Austin")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    test_villa = next((p for p in data if p["title"] == "Test Villa"), None)
    assert test_villa is not None
    assert test_villa["location"] == "Austin, TX"

    response = client.get("/api/v1/properties?location=SeattleNonExistent")
    assert response.status_code == 200
    data = response.json()
    # Filter out seeded properties if any, check if our test villa is absent
    test_villa = next((p for p in data if p["title"] == "Test Villa"), None)
    assert test_villa is None


def test_get_property_details(client):
    # Get the seeded property ID
    db = TestingSessionLocal()
    prop = (
        db.query(models.Property).filter(models.Property.title == "Test Villa").first()
    )
    prop_id = str(prop.id)
    db.close()

    response = client.get(f"/api/v1/properties/{prop_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Villa"
    assert data["price"] == 500000.00
    assert data["image_urls"] == ["https://example.com/image1.jpg"]


def test_get_property_details_not_found(client):
    random_uuid = str(uuid4())
    response = client.get(f"/api/v1/properties/{random_uuid}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Property with the specified ID does not exist"


def test_submit_contact_form(client):
    db = TestingSessionLocal()
    prop = (
        db.query(models.Property).filter(models.Property.title == "Test Villa").first()
    )
    prop_id = str(prop.id)
    db.close()

    payload = {
        "property_id": prop_id,
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "message": "I am interested in this property.",
    }
    response = client.post("/api/v1/contacts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user_name"] == "John Doe"
    assert data["user_email"] == "john@example.com"
    assert data["message"] == "I am interested in this property."
    assert "id" in data
    assert "created_at" in data


def test_submit_contact_form_invalid_property(client):
    random_uuid = str(uuid4())
    payload = {
        "property_id": random_uuid,
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "message": "I am interested in this property.",
    }
    response = client.post("/api/v1/contacts", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Property with the specified ID does not exist"


def test_submit_contact_form_validation_error(client):
    db = TestingSessionLocal()
    prop = (
        db.query(models.Property).filter(models.Property.title == "Test Villa").first()
    )
    prop_id = str(prop.id)
    db.close()

    # Missing user_name
    payload = {
        "property_id": prop_id,
        "user_email": "john@example.com",
        "message": "I am interested.",
    }
    response = client.post("/api/v1/contacts", json=payload)
    assert response.status_code == 422
