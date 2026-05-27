import os
os.environ["TESTING"] = "True"

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

def setup_function():
    Base.metadata.create_all(bind=engine)

def teardown_function():
    Base.metadata.drop_all(bind=engine)


def test_create_low_balance_alert_success():
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567890", "threshold_amount": 500, "delivery_channel": "SMS"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ACTIVE"
    assert float(data["confirmed_threshold"]) == 500.0
    assert data["delivery_channel"] == "SMS"

def test_create_low_balance_alert_invalid_threshold_low():
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567890", "threshold_amount": 50, "delivery_channel": "SMS"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid input (e.g., threshold out of range)"}


def test_create_low_balance_alert_invalid_threshold_high():
    response = client.post(
        "/api/v1/alerts/low-balance",
        json={"account_number": "1234567890", "threshold_amount": 15000, "delivery_channel": "SMS"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid input (e.g., threshold out of range)"}


def test_create_low_balance_alert_internal_error():
    pass
