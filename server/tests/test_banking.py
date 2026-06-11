import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.api.v1.endpoints.auth import get_password_hash
from server import models
import uuid
import os

# Use the same test database file as test_password_reset.py to avoid override conflicts
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Set the dependency override for this module
    app.dependency_overrides[get_db] = override_get_db

    # Create tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Clean existing data to avoid conflicts
    db.query(models.Transaction).delete()
    db.query(models.Account).delete()
    db.query(models.User).delete()
    db.commit()

    # Create test users
    hashed_pw = get_password_hash("password123")
    
    user1 = models.User(
        id=uuid.uuid4(),
        login_id="user1",
        mobile_number="1111111111",
        hashed_password=hashed_pw,
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    user2 = models.User(
        id=uuid.uuid4(),
        login_id="user2",
        mobile_number="2222222222",
        hashed_password=hashed_pw,
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer"
    )
    db.add(user1)
    db.add(user2)
    db.commit()

    # Create accounts for user1
    acc1 = models.Account(
        id=uuid.uuid4(),
        user_id=user1.id,
        account_number="111-222-333",
        account_type="Checking",
        balance=1000.00
    )
    acc2 = models.Account(
        id=uuid.uuid4(),
        user_id=user1.id,
        account_number="444-555-666",
        account_type="Savings",
        balance=5000.00
    )
    # Create account for user2
    acc3 = models.Account(
        id=uuid.uuid4(),
        user_id=user2.id,
        account_number="777-888-999",
        account_type="Checking",
        balance=200.00
    )
    db.add(acc1)
    db.add(acc2)
    db.add(acc3)
    db.commit()
    db.close()
    
    yield
    
    # Clean up after module tests
    db = TestingSessionLocal()
    db.query(models.Transaction).delete()
    db.query(models.Account).delete()
    db.query(models.User).delete()
    db.commit()
    db.close()

def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid credentials"

def test_get_accounts():
    # Login to get token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/accounts", headers=headers)
    assert response.status_code == 200
    accounts = response.json()
    assert len(accounts) == 2
    assert any(acc["account_number"] == "111-222-333" for acc in accounts)
    assert any(acc["account_number"] == "444-555-666" for acc in accounts)

def test_get_account_by_id():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get accounts first to find an ID
    accs_resp = client.get("/api/v1/accounts", headers=headers)
    acc_id = accs_resp.json()[0]["id"]

    response = client.get(f"/api/v1/accounts/{acc_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == acc_id

def test_internal_transfer():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get accounts to find IDs
    accs_resp = client.get("/api/v1/accounts", headers=headers)
    checking = next(acc for acc in accs_resp.json() if acc["account_type"] == "Checking")
    savings = next(acc for acc in accs_resp.json() if acc["account_type"] == "Savings")

    # Transfer 100 from Checking to Savings
    transfer_payload = {
        "from_account_id": checking["id"],
        "to_account_id": savings["id"],
        "amount": 100.00,
        "memo": "Test internal transfer"
    }
    response = client.post("/api/v1/transfers/internal", json=transfer_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 100.00
    assert data["new_from_balance"] == 900.00
    assert data["new_to_balance"] == 5100.00

def test_p2p_transfer():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get accounts to find Checking ID
    accs_resp = client.get("/api/v1/accounts", headers=headers)
    checking = next(acc for acc in accs_resp.json() if acc["account_type"] == "Checking")

    # Transfer 50 to user2's account "777-888-999"
    transfer_payload = {
        "from_account_id": checking["id"],
        "recipient_account_number": "777-888-999",
        "amount": 50.00,
        "password": "password123",
        "memo": "Test P2P transfer"
    }
    response = client.post("/api/v1/transfers/p2p", json=transfer_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 50.00
    assert data["new_from_balance"] == 850.00

def test_p2p_transfer_daily_limit_exceeded():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get accounts to find Savings ID (has 5100.00)
    accs_resp = client.get("/api/v1/accounts", headers=headers)
    savings = next(acc for acc in accs_resp.json() if acc["account_type"] == "Savings")

    # Try to transfer 5001.00 (exceeds daily limit of 5000)
    transfer_payload = {
        "from_account_id": savings["id"],
        "recipient_account_number": "777-888-999",
        "amount": 5001.00,
        "password": "password123",
        "memo": "Exceed limit"
    }
    response = client.post("/api/v1/transfers/p2p", json=transfer_payload, headers=headers)
    assert response.status_code == 400
    assert "limit" in response.json()["detail"].lower()

def test_get_transactions():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "user1", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/transactions", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 2  # Internal transfer + P2P transfer
