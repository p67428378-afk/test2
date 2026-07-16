import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
import uuid
from datetime import datetime

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

def test_animals_flow():
    # 1. Create an animal
    animal_data = {
        "name": "Elara",
        "species": "Elephant",
        "gps_tag_id": "GPS-EL-902"
    }
    response = client.post("/api/v1/animals", json=animal_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Elara"
    assert "id" in data
    animal_id = data["id"]

    # 2. List animals
    response = client.get("/api/v1/animals")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # 3. Record a location
    location_data = {
        "animal_id": animal_id,
        "latitude": -1.2921,
        "longitude": 36.8219,
        "timestamp": datetime.utcnow().isoformat()
    }
    response = client.post("/api/v1/animals/locations", json=location_data)
    assert response.status_code == 200
    loc_data = response.json()
    assert loc_data["latitude"] == -1.2921

    # 4. Get latest locations
    response = client.get("/api/v1/animals/locations")
    assert response.status_code == 200
    locs = response.json()
    assert len(locs) >= 1
    assert locs[0]["name"] == "Elara"

    # 5. Get migration path
    response = client.get(f"/api/v1/animals/{animal_id}/migration")
    assert response.status_code == 200
    assert len(response.json()) >= 1
