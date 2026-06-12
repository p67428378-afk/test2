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

def test_create_customer():
    # Clean up database first
    db = TestingSessionLocal()
    db.execute(Base.metadata.tables["customers"].delete())
    db.commit()
    db.close()

    payload = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "9876543210",
        "dateOfBirth": "1990-01-01",
        "address": "123 Main St, Mumbai, India",
        "aadhaarNumber": "123456789012",
        "panNumber": "ABCDE1234F"
    }
    response = client.post("/api/v1/customers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["firstName"] == "John"
    assert data["lastName"] == "Doe"
    assert data["email"] == "john.doe@example.com"
    assert data["status"] == "REVIEW"
    assert "id" in data

def test_create_customer_duplicate():
    payload = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "9876543210",
        "dateOfBirth": "1990-01-01",
        "address": "123 Main St, Mumbai, India",
        "aadhaarNumber": "123456789012",
        "panNumber": "ABCDE1234F"
    }
    response = client.post("/api/v1/customers", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_get_customer():
    # Get list of customers
    response = client.get("/api/v1/customers")
    assert response.status_code == 200
    customers = response.json()
    assert len(customers) > 0
    customer_id = customers[0]["id"]

    # Get specific customer
    response = client.get(f"/api/v1/customers/{customer_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["firstName"] == "John"
    assert data["aadhaarNumber"] == "********9012" # Masked

def test_verify_aadhaar_otp():
    response = client.get("/api/v1/customers")
    customer_id = response.json()[0]["id"]

    # Invalid OTP
    response = client.post(f"/api/v1/customers/{customer_id}/verify-aadhaar-otp", json={"otp": "111111"})
    assert response.status_code == 400

    # Valid OTP
    response = client.post(f"/api/v1/customers/{customer_id}/verify-aadhaar-otp", json={"otp": "123456"})
    assert response.status_code == 200
    assert response.json()["status"] == "PASSED"

def test_verify_pan():
    response = client.get("/api/v1/customers")
    customer_id = response.json()[0]["id"]

    response = client.post(f"/api/v1/customers/{customer_id}/verify-pan")
    assert response.status_code == 200
    assert response.json()["status"] == "PASSED"

def test_run_screening():
    response = client.get("/api/v1/customers")
    customer_id = response.json()[0]["id"]

    response = client.post(f"/api/v1/customers/{customer_id}/screening")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert len(data["results"]) == 5

def test_customer_action():
    response = client.get("/api/v1/customers")
    customer_id = response.json()[0]["id"]

    response = client.post(f"/api/v1/customers/{customer_id}/action", json={"status": "APPROVED", "notes": "All checks passed manually."})
    assert response.status_code == 200
    assert response.json()["status"] == "APPROVED"
