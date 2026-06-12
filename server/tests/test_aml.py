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

def test_create_transaction_and_alerts():
    # Create a customer first
    db = TestingSessionLocal()
    db.execute(Base.metadata.tables["customers"].delete())
    db.execute(Base.metadata.tables["transactions"].delete())
    db.execute(Base.metadata.tables["alerts"].delete())
    db.commit()
    db.close()

    payload = {
        "firstName": "Jane",
        "lastName": "Sanctioned", # Will trigger screening match
        "email": "jane.sanctioned@example.com",
        "phone": "9876543211",
        "dateOfBirth": "1992-02-02",
        "address": "456 Main St, Delhi, India",
        "aadhaarNumber": "123456789013",
        "panNumber": "ABCDE1234G"
    }
    response = client.post("/api/v1/customers", json=payload)
    assert response.status_code == 201
    customer_id = response.json()["id"]

    # Run screening to set status to FLAGGED
    response = client.post(f"/api/v1/customers/{customer_id}/screening")
    assert response.status_code == 200

    # Create a normal transaction (amount <= 50000)
    tx_payload = {
        "customerId": customer_id,
        "amount": 10000.0,
        "transactionType": "DEPOSIT"
    }
    response = client.post("/api/v1/transactions", json=tx_payload)
    assert response.status_code == 201
    assert response.json()["alertTriggered"] is False

    # Create a transaction that triggers alert due to customer status (amount > 50000)
    tx_payload = {
        "customerId": customer_id,
        "amount": 60000.0,
        "transactionType": "TRANSFER",
        "destinationAccount": "1234567890"
    }
    response = client.post("/api/v1/transactions", json=tx_payload)
    assert response.status_code == 201
    assert response.json()["alertTriggered"] is True

    # Create a high-value transaction (amount > 1,000,000)
    tx_payload = {
        "customerId": customer_id,
        "amount": 1500000.0,
        "transactionType": "DEPOSIT"
    }
    response = client.post("/api/v1/transactions", json=tx_payload)
    assert response.status_code == 201
    assert response.json()["alertTriggered"] is True

    # List alerts
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 2
