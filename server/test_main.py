import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Set testing environment variable
os.environ["TESTING"] = "True"

from server.main import app
from server.database import Base, get_db
from server.services import MOCK_CBS_ACCOUNTS

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    # Reset mock account balances before each test
    MOCK_CBS_ACCOUNTS["1234567890"] = 5000.00
    MOCK_CBS_ACCOUNTS["9876543210"] = 150.00
    MOCK_CBS_ACCOUNTS["5555555555"] = 10.00
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_get_dashboard_unauthorized():
    response = client.get("/api/v1/recharge/dashboard")
    assert response.status_code == 401


def test_get_dashboard_success():
    headers = {"Authorization": "Bearer valid-token"}
    response = client.get("/api/v1/recharge/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "linked_account" in data
    assert data["linked_account"]["account_number"] == "1234567890"
    assert data["linked_account"]["balance"] == 5000.00


def test_validate_operator_success():
    headers = {"Authorization": "Bearer valid-token"}
    payload = {"account_number": "1234567890", "operator_name": "Airtel"}
    response = client.post(
        "/api/v1/recharge/validate-operator", json=payload, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["biller_id"] == "B_AIRTEL_01"


def test_validate_operator_invalid():
    headers = {"Authorization": "Bearer valid-token"}
    payload = {"account_number": "1234567890", "operator_name": "InvalidOperator"}
    response = client.post(
        "/api/v1/recharge/validate-operator", json=payload, headers=headers
    )
    assert response.status_code == 400


def test_recharge_success():
    headers = {"Authorization": "Bearer valid-token"}
    payload = {"account_number": "1234567890", "amount": 500.00, "operator_name": "Jio"}
    response = client.post("/api/v1/recharge", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RECHARGED"
    assert "transactionId" in data
    assert "bbpsReferenceId" in data
    assert "operatorReferenceId" in data

    # Verify balance debited
    assert MOCK_CBS_ACCOUNTS["1234567890"] == 4500.00


def test_recharge_insufficient_funds():
    headers = {"Authorization": "Bearer valid-token"}
    payload = {"account_number": "9876543210", "amount": 500.00, "operator_name": "Jio"}
    response = client.post("/api/v1/recharge", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Insufficient funds" in response.json()["detail"]


def test_recharge_bbps_failure_rollback():
    headers = {"Authorization": "Bearer valid-token"}
    # 9999.00 triggers mock BBPS failure
    payload = {
        "account_number": "1234567890",
        "amount": 9999.00,
        "operator_name": "Jio",
    }
    response = client.post("/api/v1/recharge", json=payload, headers=headers)
    assert response.status_code == 500

    # Verify balance was rolled back (not debited)
    assert MOCK_CBS_ACCOUNTS["1234567890"] == 5000.00
