import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import uuid

from server.database import Base, get_db
from server.main import app
from server.models import User, Account, PendingTransaction
from server.services.token_service import TokenService

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_verify_transaction_success(client, db):
    # Create a test user
    user = User(
        login_id="premier_user",
        mobile_number="+15550199",
        hashed_password="hashed_password_here",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer",
    )
    db.add(user)
    db.commit()

    # Create a Premier Checking Account
    account = Account(user_id=user.id, account_type="Premier Checking", balance=5000.00)
    db.add(account)
    db.commit()

    # Create a Pending Transaction
    jti = str(uuid.uuid4())
    txn_id = uuid.uuid4()
    token = TokenService.generate_token(txn_id, jti, expires_in_minutes=10)

    transaction = PendingTransaction(
        id=txn_id,
        account_id=account.id,
        merchant_name="Best Buy Store #1402",
        amount=2450.00,
        status="pending",
        token_jti=jti,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(transaction)
    db.commit()

    # Verify transaction endpoint
    response = client.get(f"/api/v1/transactions/{txn_id}/verify?token={token}")
    assert response.status_code == 200
    data = response.json()
    assert data["merchant_name"] == "Best Buy Store #1402"
    assert data["amount"] == 2450.00
    assert data["status"] == "pending"


def test_verify_transaction_expired(client, db):
    user = User(
        login_id="premier_user_2",
        mobile_number="+15550200",
        hashed_password="hashed_password_here",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer",
    )
    db.add(user)
    db.commit()

    account = Account(user_id=user.id, account_type="Premier Checking", balance=5000.00)
    db.add(account)
    db.commit()

    jti = str(uuid.uuid4())
    txn_id = uuid.uuid4()
    # Generate token that is already expired
    token = TokenService.generate_token(txn_id, jti, expires_in_minutes=-5)

    transaction = PendingTransaction(
        id=txn_id,
        account_id=account.id,
        merchant_name="Best Buy Store #1402",
        amount=2450.00,
        status="pending",
        token_jti=jti,
        expires_at=datetime.utcnow() - timedelta(minutes=5),
    )
    db.add(transaction)
    db.commit()

    response = client.get(f"/api/v1/transactions/{txn_id}/verify?token={token}")
    assert response.status_code in [403, 400]  # Expired token or expired transaction


def test_perform_transaction_action_approve(client, db):
    user = User(
        login_id="premier_user_3",
        mobile_number="+15550201",
        hashed_password="hashed_password_here",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer",
    )
    db.add(user)
    db.commit()

    account = Account(user_id=user.id, account_type="Premier Checking", balance=5000.00)
    db.add(account)
    db.commit()

    jti = str(uuid.uuid4())
    txn_id = uuid.uuid4()
    token = TokenService.generate_token(txn_id, jti, expires_in_minutes=10)

    transaction = PendingTransaction(
        id=txn_id,
        account_id=account.id,
        merchant_name="Best Buy Store #1402",
        amount=2450.00,
        status="pending",
        token_jti=jti,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(transaction)
    db.commit()

    # Approve transaction
    response = client.post(
        f"/api/v1/transactions/{txn_id}/action",
        json={"action": "approve", "token": token},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"

    # Try to reuse the same token (should fail as single-use)
    response_retry = client.post(
        f"/api/v1/transactions/{txn_id}/action",
        json={"action": "approve", "token": token},
    )
    assert response_retry.status_code == 400
