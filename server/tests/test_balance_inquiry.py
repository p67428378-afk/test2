import pytest
import uuid
import os
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.main import app
from server.database import Base, get_db
from server import models

# Use the same database file as the existing password reset tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Clear and recreate tables for each test to ensure isolation
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up the test database file after tests
    if os.path.exists("test.db"):
        try:
            os.remove("test.db")
        except Exception:
            pass

def test_balance_inquiry_success():
    db = TestingSessionLocal()
    
    # Create a test user
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user1",
        mobile_number="1234567890",
        hashed_password="hashed_password",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    db.add(user)
    
    # Create an active account for the user
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user_id,
        account_number="123456789012",
        ledger_balance=10000.00,
        available_balance=9500.00,
        currency="INR",
        daily_transaction_limit=50000.00,
        remaining_daily_limit=45000.00,
        status="ACTIVE",
        reason_code=None
    )
    db.add(account)
    db.commit()
    db.close()
    
    # Perform balance inquiry
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get(f"/api/v1/accounts/{str(account_id)}/balance", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["accountNumber"] == "********9012"
    assert data["ledgerBalance"] == 10000.00
    assert data["availableBalance"] == 9500.00
    assert data["currency"] == "INR"
    assert data["remainingLimit"] == 45000.00
    assert data["status"] == "ACTIVE"
    assert data["reasonCode"] is None
    assert "timestamp" in data

    # Verify audit log was created
    db = TestingSessionLocal()
    logs = db.query(models.AuditLog).filter(models.AuditLog.user_id == user_id).all()
    assert len(logs) == 1
    assert logs[0].account_id == account_id
    assert logs[0].event_type == "BALANCE_INQUIRY"
    db.close()

def test_balance_inquiry_dormant_account():
    db = TestingSessionLocal()
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user2",
        mobile_number="0987654321",
        hashed_password="hashed_password",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    db.add(user)
    
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user_id,
        account_number="987654321098",
        ledger_balance=500.00,
        available_balance=500.00,
        currency="INR",
        daily_transaction_limit=1000.00,
        remaining_daily_limit=1000.00,
        status="DORMANT",
        reason_code=None
    )
    db.add(account)
    db.commit()
    db.close()
    
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get(f"/api/v1/accounts/{str(account_id)}/balance", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["accountNumber"] == "********1098"
    assert data["status"] == "DORMANT"
    assert data["reasonCode"] == "ACC_DORMANT"

def test_balance_inquiry_frozen_account():
    db = TestingSessionLocal()
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user3",
        mobile_number="1112223333",
        hashed_password="hashed_password",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    db.add(user)
    
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user_id,
        account_number="111222333344",
        ledger_balance=0.00,
        available_balance=0.00,
        currency="INR",
        daily_transaction_limit=0.00,
        remaining_daily_limit=0.00,
        status="FROZEN",
        reason_code=None
    )
    db.add(account)
    db.commit()
    db.close()
    
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get(f"/api/v1/accounts/{str(account_id)}/balance", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["accountNumber"] == "********3344"
    assert data["status"] == "FROZEN"
    assert data["reasonCode"] == "ACC_FROZEN"

def test_balance_inquiry_expired_token():
    headers = {"Authorization": "Bearer expired-token-someuser"}
    response = client.get(f"/api/v1/accounts/{str(uuid.uuid4())}/balance", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "AUTH_EXPIRED"

def test_balance_inquiry_invalid_token():
    headers = {"Authorization": "Bearer invalid-token"}
    response = client.get(f"/api/v1/accounts/{str(uuid.uuid4())}/balance", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid session token"

def test_balance_inquiry_unauthorized_account():
    db = TestingSessionLocal()
    
    # Create two users
    user1_id = uuid.uuid4()
    user2_id = uuid.uuid4()
    
    user1 = models.User(
        id=user1_id,
        login_id="user1",
        mobile_number="1234567890",
        hashed_password="hashed_password",
        security_question="Q",
        security_answer_hash="A"
    )
    user2 = models.User(
        id=user2_id,
        login_id="user2",
        mobile_number="0987654321",
        hashed_password="hashed_password",
        security_question="Q",
        security_answer_hash="A"
    )
    db.add(user1)
    db.add(user2)
    
    # Create account belonging to user2
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user2_id,
        account_number="123456789012",
        ledger_balance=1000.00,
        available_balance=1000.00,
        currency="INR",
        daily_transaction_limit=5000.00,
        remaining_daily_limit=5000.00,
        status="ACTIVE",
        reason_code=None
    )
    db.add(account)
    db.commit()
    db.close()
    
    # User1 tries to access User2's account
    headers = {"Authorization": f"Bearer valid-token-{str(user1_id)}"}
    response = client.get(f"/api/v1/accounts/{str(account_id)}/balance", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Requested account does not belong to the authenticated user"

def test_balance_inquiry_account_not_found():
    db = TestingSessionLocal()
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user1",
        mobile_number="1234567890",
        hashed_password="hashed_password",
        security_question="Q",
        security_answer_hash="A"
    )
    db.add(user)
    db.commit()
    db.close()
    
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get(f"/api/v1/accounts/{str(uuid.uuid4())}/balance", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Account not found"

def test_get_audit_logs():
    db = TestingSessionLocal()
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user1",
        mobile_number="1234567890",
        hashed_password="hashed_password",
        security_question="Q",
        security_answer_hash="A"
    )
    db.add(user)
    
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user_id,
        account_number="123456789012",
        ledger_balance=1000.00,
        available_balance=1000.00,
        currency="INR",
        daily_transaction_limit=5000.00,
        remaining_daily_limit=5000.00,
        status="ACTIVE",
        reason_code=None
    )
    db.add(account)
    
    # Add some audit logs
    log1 = models.AuditLog(
        id=uuid.uuid4(),
        user_id=user_id,
        account_id=account_id,
        event_type="BALANCE_INQUIRY",
        details="Log 1"
    )
    log2 = models.AuditLog(
        id=uuid.uuid4(),
        user_id=user_id,
        account_id=account_id,
        event_type="BALANCE_INQUIRY",
        details="Log 2"
    )
    db.add(log1)
    db.add(log2)
    db.commit()
    db.close()
    
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get("/api/v1/audit/logs", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["logs"]) == 2
    assert data["logs"][0]["accountId"] == str(account_id)
    assert data["logs"][0]["eventType"] == "BALANCE_INQUIRY"

def test_get_transactions():
    db = TestingSessionLocal()
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="user1",
        mobile_number="1234567890",
        hashed_password="hashed_password",
        security_question="Q",
        security_answer_hash="A"
    )
    db.add(user)
    
    account_id = uuid.uuid4()
    account = models.Account(
        id=account_id,
        user_id=user_id,
        account_number="123456789012",
        ledger_balance=1000.00,
        available_balance=1000.00,
        currency="INR",
        daily_transaction_limit=5000.00,
        remaining_daily_limit=5000.00,
        status="ACTIVE",
        reason_code=None
    )
    db.add(account)
    
    # Add some transactions
    tx1 = models.Transaction(
        id=uuid.uuid4(),
        account_id=account_id,
        amount=100.00,
        type="CREDIT",
        description="Salary credit"
    )
    tx2 = models.Transaction(
        id=uuid.uuid4(),
        account_id=account_id,
        amount=50.00,
        type="DEBIT",
        description="ATM withdrawal"
    )
    db.add(tx1)
    db.add(tx2)
    db.commit()
    db.close()
    
    headers = {"Authorization": f"Bearer valid-token-{str(user_id)}"}
    response = client.get(f"/api/v1/accounts/{str(account_id)}/transactions", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["transactions"]) == 2
    assert data["transactions"][0]["accountId"] == str(account_id)
    assert data["transactions"][0]["type"] in ["CREDIT", "DEBIT"]
