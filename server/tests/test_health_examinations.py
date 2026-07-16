import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from datetime import date

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

def test_health_examinations_flow():
    # Create animal first
    animal_data = {
        "name": "Leo",
        "species": "Lion",
        "gps_tag_id": "GPS-LE-101"
    }
    response = client.post("/api/v1/animals", json=animal_data)
    assert response.status_code == 200
    animal_id = response.json()["id"]

    # Create health exam
    exam_data = {
        "animal_id": animal_id,
        "examination_date": date.today().isoformat(),
        "veterinarian": "Dr. Rostova",
        "health_status": "Healthy",
        "notes": "All vital signs normal."
    }
    response = client.post("/api/v1/health-examinations", json=exam_data)
    assert response.status_code == 200
    data = response.json()
    assert data["veterinarian"] == "Dr. Rostova"
    assert data["health_status"] == "Healthy"

    # List health exams
    response = client.get("/api/v1/health-examinations")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # List health exams for specific animal
    response = client.get(f"/api/v1/health-examinations?animal_id={animal_id}")
    assert response.status_code == 200
    assert len(response.json()) >= 1
