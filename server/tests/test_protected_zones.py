import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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

def test_protected_zones_flow():
    # Create zone
    zone_data = {
        "name": "Serengeti North",
        "area": '{"type": "Polygon", "coordinates": [[[34.0, -2.0], [35.0, -2.0], [35.0, -1.0], [34.0, -1.0], [34.0, -2.0]]]}'
    }
    response = client.post("/api/v1/protected-zones", json=zone_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Serengeti North"
    zone_id = data["id"]

    # List zones
    response = client.get("/api/v1/protected-zones")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Get specific zone
    response = client.get(f"/api/v1/protected-zones/{zone_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Serengeti North"

    # Update zone
    update_data = {
        "name": "Serengeti North Updated",
        "area": '{"type": "Polygon", "coordinates": [[[34.0, -2.0], [36.0, -2.0], [36.0, -1.0], [34.0, -1.0], [34.0, -2.0]]]}'
    }
    response = client.put(f"/api/v1/protected-zones/{zone_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Serengeti North Updated"

    # Delete zone
    response = client.delete(f"/api/v1/protected-zones/{zone_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify deleted
    response = client.get(f"/api/v1/protected-zones/{zone_id}")
    assert response.status_code == 404
