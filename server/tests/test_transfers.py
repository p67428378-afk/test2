import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models, crud
from uuid import uuid4

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_transfers.db"

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

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_transfer_flow():
    db = TestingSessionLocal()
    
    # Create test user
    user = models.User(
        login_id="test_user_transfer",
        mobile_number="9876543210",
        hashed_password="hashed",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create source and destination accounts
    source_acc = crud.create_account(db, user_id=user.id, balance=1000.0, currency="USD")
    dest_acc = crud.create_account(db, user_id=user.id, balance=500.0, currency="USD")
    
    # 1. Successful transfer
    response = client.post(
        "/api/v1/transfers",
        json={
            "amount": 200.0,
            "currency": "USD",
            "source_account_id": str(source_acc.id),
            "destination_account_id": str(dest_acc.id),
            "transfer_type": "IMPS"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert "transaction_id" in data
    assert "created_at" in data
    
    # Verify balances in DB
    db.refresh(source_acc)
    db.refresh(dest_acc)
    assert source_acc.balance == 800.0
    assert dest_acc.balance == 700.0
    
    # 2. Query transaction status
    tx_id = data["transaction_id"]
    query_response = client.get(f"/api/v1/transfers/{tx_id}")
    assert query_response.status_code == 200
    tx_data = query_response.json()
    assert tx_data["amount"] == 200.0
    assert tx_data["status"] == "COMPLETED"
    assert tx_data["source_account_id"] == str(source_acc.id)
    assert tx_data["destination_account_id"] == str(dest_acc.id)
    
    # 3. Insufficient balance error
    response_fail = client.post(
        "/api/v1/transfers",
        json={
            "amount": 1000.0,
            "currency": "USD",
            "source_account_id": str(source_acc.id),
            "destination_account_id": str(dest_acc.id),
            "transfer_type": "IMPS"
        }
    )
    assert response_fail.status_code == 400
    assert response_fail.json()["detail"] == "Insufficient balance or invalid account IDs"
    
    # 4. Invalid account ID error
    response_invalid = client.post(
        "/api/v1/transfers",
        json={
            "amount": 10.0,
            "currency": "USD",
            "source_account_id": str(uuid4()),
            "destination_account_id": str(dest_acc.id),
            "transfer_type": "IMPS"
        }
    )
    assert response_invalid.status_code == 400
    assert response_invalid.json()["detail"] == "Insufficient balance or invalid account IDs"

def test_query_transaction_not_found():
    response = client.get(f"/api/v1/transfers/{uuid4()}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Transaction not found"

def test_bookings_endpoint():
    response = client.get("/api/v1/bookings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["client"]["name"] == "Alice Smith"
    assert data[0]["trek"]["name"] == "Everest Base Camp"

def test_availability_endpoint():
    response = client.get(f"/api/v1/availability/{uuid4()}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["is_available"] is True

def test_notifications_endpoint():
    response = client.post(
        "/api/v1/notifications",
        json={
            "client_id": str(uuid4()),
            "message": "Hello Alice, your booking is confirmed!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "message_id" in data
