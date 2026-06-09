import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models

# Setup SQLite file-based database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_inventory.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)
        if os.path.exists("test_inventory.db"):
            try:
                os.remove("test_inventory.db")
            except Exception:
                pass

def test_create_and_read_product(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # Create product
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Tempered Glass 12mm",
            "description": "Heavy duty tempered glass",
            "cost": 50.00,
            "price": 120.00,
            "stock_quantity": 100
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Tempered Glass 12mm"
    assert "product_id" in data

    # Read inventory
    response = client.get("/api/v1/inventory")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Tempered Glass 12mm"

def test_update_product(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # Create product
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Float Glass 6mm",
            "description": "Standard float glass",
            "cost": 20.00,
            "price": 45.00,
            "stock_quantity": 50
        }
    )
    product_id = response.json()["product_id"]

    # Update product
    response = client.put(
        f"/api/v1/inventory/{product_id}",
        json={"stock_quantity": 60, "price": 50.00}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["stock_quantity"] == 60
    assert float(data["price"]) == 50.00

def test_delete_product(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # Create product
    response = client.post(
        "/api/v1/inventory",
        json={
            "name": "Laminated Glass 8mm",
            "description": "Laminated safety glass",
            "cost": 40.00,
            "price": 90.00,
            "stock_quantity": 30
        }
    )
    product_id = response.json()["product_id"]

    # Delete product
    response = client.delete(f"/api/v1/inventory/{product_id}")
    assert response.status_code == 200
    assert response.json() == {"success": True}

    # Verify deleted
    response = client.get("/api/v1/inventory")
    assert response.json()["total"] == 0
