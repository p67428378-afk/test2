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

def test_create_and_list_flowers():
    # List flowers initially (should be empty)
    response = client.get("/api/v1/flowers")
    assert response.status_code == 200
    assert response.json() == []

    # Create a new flower type
    response = client.post(
        "/api/v1/flowers",
        json={"flower_type": "Rose"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "flower_id" in data
    assert data["flower_type"] == "Rose"

    # Create duplicate flower type (should fail)
    response = client.post(
        "/api/v1/flowers",
        json={"flower_type": "Rose"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Flower type already exists"

    # List flowers again (should contain Rose)
    response = client.get("/api/v1/flowers")
    assert response.status_code == 200
    flowers = response.json()
    assert len(flowers) == 1
    assert flowers[0]["flower_type"] == "Rose"
