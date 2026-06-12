import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db

DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_growth_and_sensor_operations():
    # Create a flower type first
    response = client.post(
        "/api/v1/flowers",
        json={"flower_type": "Lily"}
    )
    assert response.status_code == 201
    flower_id = response.json()["flower_id"]

    # Create plant batch
    response = client.post(
        "/api/v1/plant-batches",
        json={
            "flower_id": flower_id,
            "growth_stage": "Seeding"
        }
    )
    assert response.status_code == 201
    batch_id = response.json()["batch_id"]
    assert response.json()["growth_stage"] == "Seeding"

    # Create plant batch with invalid flower_id (should fail)
    response = client.post(
        "/api/v1/plant-batches",
        json={
            "flower_id": "invalid-uuid",
            "growth_stage": "Seeding"
        }
    )
    assert response.status_code == 400

    # Update plant batch growth stage
    response = client.put(
        f"/api/v1/plant-batches/{batch_id}",
        json={
            "growth_stage": "Sprouting"
        }
    )
    assert response.status_code == 200
    assert response.json()["growth_stage"] == "Sprouting"

    # Submit sensor data
    response = client.post(
        "/api/v1/sensor-data",
        json={
            "batch_id": batch_id,
            "temperature": 24.5,
            "humidity": 60.0,
            "soil_moisture": 45.2,
            "light_intensity": 500.0
        }
    )
    assert response.status_code == 201
    assert response.json()["temperature"] == 24.5

    # Submit sensor data with low soil moisture (should trigger alert and succeed)
    response = client.post(
        "/api/v1/sensor-data",
        json={
            "batch_id": batch_id,
            "temperature": 24.5,
            "humidity": 60.0,
            "soil_moisture": 25.0,  # Low soil moisture (< 30.0)
            "light_intensity": 500.0
        }
    )
    assert response.status_code == 201

    # Submit sensor data with invalid batch_id (should fail)
    response = client.post(
        "/api/v1/sensor-data",
        json={
            "batch_id": "invalid-uuid",
            "temperature": 24.5,
            "humidity": 60.0,
            "soil_moisture": 45.2,
            "light_intensity": 500.0
        }
    )
    assert response.status_code == 400

    # List plant batches (should include latest sensor data)
    response = client.get("/api/v1/plant-batches")
    assert response.status_code == 200
    batches = response.json()
    assert len(batches) >= 1
    assert batches[0]["flower_type"] == "Lily"
    assert batches[0]["latest_sensor_data"] is not None
    assert batches[0]["latest_sensor_data"]["soil_moisture"] == 25.0
