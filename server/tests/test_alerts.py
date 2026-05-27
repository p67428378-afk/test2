
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from decimal import Decimal

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine) 
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


def test_create_low_balance_alert_success(db_session):
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567890", "threshold_amount": 500.00, "delivery_channel": "SMS"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ACTIVE"
    assert float(data["confirmed_threshold"]) == 500.00
    assert data["delivery_channel"] == "SMS"

def test_create_low_balance_alert_threshold_too_low(db_session):
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567891", "threshold_amount": 50.00, "delivery_channel": "SMS"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Threshold amount must be between 100 and 10,000."}

def test_create_low_balance_alert_threshold_too_high(db_session):
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567892", "threshold_amount": 15000.00, "delivery_channel": "Email"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Threshold amount must be between 100 and 10,000."}

def test_update_existing_alert(db_session):
    # Create an initial alert
    client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "9876543210", "threshold_amount": 200.00, "delivery_channel": "Email"}
    )
    
    # Update the alert
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "9876543210", "threshold_amount": 1000.00, "delivery_channel": "SMS"}
    )
    assert response.status_code == 200
    data = response.json()
    assert float(data["confirmed_threshold"]) == 1000.00
    assert data["delivery_channel"] == "SMS"
