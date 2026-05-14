
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import schemas
from uuid import uuid4

# Use an in-memory SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_get_operators_mobile(test_db):
    response = client.get("/api/v1/recharge/operators?accountNumber=1234567890&serviceType=mobile")
    assert response.status_code == 200
    data = response.json()
    assert "operators" in data
    assert len(data["operators"]) == 3

def test_get_operators_dth(test_db):
    response = client.get("/api/v1/recharge/operators?accountNumber=12345&serviceType=dth")
    assert response.status_code == 200
    data = response.json()
    assert "operators" in data
    assert len(data["operators"]) == 2

def test_initiate_recharge_success(test_db):
    request_data = {
        "account_number": "1234567890",
        "amount": 100.0,
        "operator_id": "VODAFONE",
        "service_type": "mobile",
        "user_id": "test_user"
    }
    response = client.post("/api/v1/recharge/initiate", json=request_data)
    assert response.status_code == 201
    data = response.json()
    assert "request_id" in data

def test_confirm_recharge_success(test_db):
    # First, initiate a recharge
    initiate_request = {
        "account_number": "1234567890",
        "amount": 100.0,
        "operator_id": "VODAFONE",
        "service_type": "mobile",
        "user_id": "test_user"
    }
    initiate_response = client.post("/api/v1/recharge/initiate", json=initiate_request)
    request_id = initiate_response.json()["request_id"]

    # Then, confirm it
    confirm_request = {"request_id": request_id, "user_confirmation": True}
    confirm_response = client.post("/api/v1/recharge/confirm", json=confirm_request)
    assert confirm_response.status_code == 200
    data = confirm_response.json()
    assert data["status"] == "RECHARGED"
    assert data["message"] == "Recharge successful!"

def test_get_recharge_status_success(test_db):
    # First, initiate and confirm a recharge
    initiate_request = {
        "account_number": "1234567890",
        "amount": 100.0,
        "operator_id": "VODAFONE",
        "service_type": "mobile",
        "user_id": "test_user"
    }
    initiate_response = client.post("/api/v1/recharge/initiate", json=initiate_request)
    request_id = initiate_response.json()["request_id"]
    confirm_request = {"request_id": request_id, "user_confirmation": True}
    client.post("/api/v1/recharge/confirm", json=confirm_request)

    # Then, get the status
    status_response = client.get(f"/api/v1/recharge/status/{request_id}")
    assert status_response.status_code == 200
    data = status_response.json()
    assert data["status"] == "RECHARGED"
    assert data["transaction_id"] == request_id

def test_get_recharge_status_not_found(test_db):
    random_uuid = str(uuid4())
    response = client.get(f"/api/v1/recharge/status/{random_uuid}")
    assert response.status_code == 404
