import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models

# Setup SQLite file-based database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
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
        # Clean up the temp db file
        if os.path.exists("test_temp.db"):
            try:
                os.remove("test_temp.db")
            except Exception:
                pass

def test_create_and_list_customers(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # Create customer
    response = client.post(
        "/api/v1/customers",
        json={"name": "John Doe", "contact_info": "john@example.com"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert "customer_id" in data

    # List customers
    response = client.get("/api/v1/customers")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "John Doe"
