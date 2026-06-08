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

def test_get_pipelines():
    response = client.get("/api/v1/pipelines")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert any(p["name"] == "Sector 4B" for p in data)

def test_get_pipeline_sensors():
    # First get pipelines to find an ID
    response = client.get("/api/v1/pipelines")
    pipelines = response.json()
    p1_id = next(p["id"] for p in pipelines if p["name"] == "Sector 4B")
    
    response_sensors = client.get(f"/api/v1/pipelines/{p1_id}/sensors")
    assert response_sensors.status_code == 200
    sensors = response_sensors.json()
    assert len(sensors) >= 1
    assert sensors[0]["location"] == "Sector 4B"
    assert len(sensors[0]["readings_24h"]) == 24

def test_get_pipeline_sensors_not_found():
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/api/v1/pipelines/{fake_id}/sensors")
    assert response.status_code == 404
    assert response.json()["detail"] == "Pipeline not found"
