import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta
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

def test_inventory_operations():
    # Create a flower type first
    response = client.post(
        "/api/v1/flowers",
        json={"flower_type": "Tulip"}
    )
    assert response.status_code == 201
    flower_id = response.json()["flower_id"]

    # Add inventory item
    harvest_date = datetime.now().isoformat()
    response = client.post(
        "/api/v1/inventory",
        json={
            "flower_id": flower_id,
            "quantity": 100,
            "harvest_date": harvest_date,
            "status": "Fresh",
            "shelf_life": 7
        }
    )
    assert response.status_code == 201
    inventory_id = response.json()["inventory_id"]
    assert response.json()["quantity"] == 100

    # Add inventory item with invalid flower_id (should fail)
    response = client.post(
        "/api/v1/inventory",
        json={
            "flower_id": "invalid-uuid",
            "quantity": 100,
            "harvest_date": harvest_date,
            "status": "Fresh",
            "shelf_life": 7
        }
    )
    assert response.status_code == 400

    # List inventory
    response = client.get("/api/v1/inventory")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 1
    assert items[0]["flower_type"] == "Tulip"
    assert items[0]["approaching_expiration"] is False

    # Update inventory item
    response = client.put(
        f"/api/v1/inventory/{inventory_id}",
        json={
            "quantity": 50,
            "status": "Sold"
        }
    )
    assert response.status_code == 200
    assert response.json()["quantity"] == 50
    assert response.json()["status"] == "Sold"

    # Update non-existent inventory item (should fail)
    response = client.put(
        "/api/v1/inventory/non-existent-id",
        json={
            "quantity": 50,
            "status": "Sold"
        }
    )
    assert response.status_code == 404
