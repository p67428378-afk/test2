import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models
from datetime import date
from decimal import Decimal

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp_roundups.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


def test_get_roundup_summary(db):
    # Seed user
    user = models.User(email="test@example.com", is_roundup_enabled=True)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Seed linked account
    linked_acc = models.LinkedAccount(
        user_id=user.id,
        plaid_access_token="mock_plaid_token_123",
        account_name="Primary Debit Card",
    )
    db.add(linked_acc)
    db.commit()

    # Seed transactions
    # 1. Starbucks: $4.25 -> $0.75 roundup (Invested)
    tx1 = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_1",
        merchant_name="Starbucks Coffee",
        amount=Decimal("4.25"),
        roundup_amount=Decimal("0.75"),
        transaction_date=date.today(),
        status="Invested",
    )
    # 2. Whole Foods: $24.10 -> $0.90 roundup (Pending)
    tx2 = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_2",
        merchant_name="Whole Foods Market",
        amount=Decimal("24.10"),
        roundup_amount=Decimal("0.90"),
        transaction_date=date.today(),
        status="Pending",
    )
    db.add_all([tx1, tx2])
    db.commit()

    # Seed today's investment
    inv = models.RoundupInvestment(
        user_id=user.id,
        aggregated_amount=Decimal("0.75"),
        investment_date=date.today(),
        status="Invested",
    )
    db.add(inv)
    db.commit()

    # Override get_db
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        response = client.get("/api/v1/roundups/summary")
        assert response.status_code == 200
        data = response.json()
        assert data["is_roundup_enabled"] is True
        assert data["total_roundup_amount"] == 0.75
        assert data["today_invested_amount"] == 0.75


def test_list_transactions(db):
    user = models.User(email="test@example.com", is_roundup_enabled=True)
    db.add(user)
    db.commit()
    db.refresh(user)

    linked_acc = models.LinkedAccount(
        user_id=user.id,
        plaid_access_token="mock_plaid_token_123",
        account_name="Primary Debit Card",
    )
    db.add(linked_acc)
    db.commit()

    tx = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_1",
        merchant_name="Starbucks Coffee",
        amount=Decimal("4.25"),
        roundup_amount=Decimal("0.75"),
        transaction_date=date.today(),
        status="Pending",
    )
    db.add(tx)
    db.commit()

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        response = client.get("/api/v1/roundups/transactions")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["merchant_name"] == "Starbucks Coffee"
        assert data["items"][0]["roundup_amount"] == 0.75


def test_trigger_daily_job(db):
    user = models.User(email="test@example.com", is_roundup_enabled=True)
    db.add(user)
    db.commit()
    db.refresh(user)

    linked_acc = models.LinkedAccount(
        user_id=user.id,
        plaid_access_token="mock_plaid_token_123",
        account_name="Primary Debit Card",
    )
    db.add(linked_acc)
    db.commit()

    # Seed three transactions with round-ups of $0.55, $0.20, and $0.80
    tx1 = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_1",
        merchant_name="Merchant 1",
        amount=Decimal("12.45"),
        roundup_amount=Decimal("0.55"),
        transaction_date=date.today(),
        status="Pending",
    )
    tx2 = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_2",
        merchant_name="Merchant 2",
        amount=Decimal("5.80"),
        roundup_amount=Decimal("0.20"),
        transaction_date=date.today(),
        status="Pending",
    )
    tx3 = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_3",
        merchant_name="Merchant 3",
        amount=Decimal("1.20"),
        roundup_amount=Decimal("0.80"),
        transaction_date=date.today(),
        status="Pending",
    )
    db.add_all([tx1, tx2, tx3])
    db.commit()

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        response = client.post("/api/v1/roundups/trigger-daily-job")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "Success"
        assert data["processed_users_count"] == 1
        assert data["total_invested_amount"] == 1.55

        # Verify transactions are updated to 'Invested'
        db.refresh(tx1)
        db.refresh(tx2)
        db.refresh(tx3)
        assert tx1.status == "Invested"
        assert tx2.status == "Invested"
        assert tx3.status == "Invested"

        # Verify investment record is created
        inv = (
            db.query(models.RoundupInvestment)
            .filter(models.RoundupInvestment.user_id == user.id)
            .first()
        )
        assert inv is not None
        assert inv.aggregated_amount == Decimal("1.55")
        assert inv.status == "Invested"


def test_calculate_roundup(db):
    user = models.User(
        email="test@example.com",
        is_roundup_enabled=True,
        roundup_multiplier=2,
        is_whole_dollar_catch_all_enabled=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        # Test normal fractional amount: $4.25 -> raw $0.75 -> x2 multiplier -> $1.50
        response = client.post(
            "/api/v1/roundups/calculate", json={"transaction_amount": 4.25}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["raw_roundup"] == 0.75
        assert data["applied_multiplier"] == 2
        assert data["is_whole_dollar_catch_all_applied"] is False
        assert data["final_roundup_amount"] == 1.50

        # Test whole dollar amount with catch-all enabled: $5.00 -> raw $0.00 -> catch-all $1.00 -> x2 multiplier -> $2.00
        response = client.post(
            "/api/v1/roundups/calculate", json={"transaction_amount": 5.00}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["raw_roundup"] == 0.0
        assert data["applied_multiplier"] == 2
        assert data["is_whole_dollar_catch_all_applied"] is True
        assert data["final_roundup_amount"] == 2.00


def test_milestones(db):
    user = models.User(email="test@example.com", is_roundup_enabled=True)
    db.add(user)
    db.commit()
    db.refresh(user)

    linked_acc = models.LinkedAccount(
        user_id=user.id,
        plaid_access_token="mock_plaid_token_123",
        account_name="Primary Debit Card",
    )
    db.add(linked_acc)
    db.commit()

    # Seed transactions to reach $50.00
    tx = models.Transaction(
        user_id=user.id,
        linked_account_id=linked_acc.id,
        plaid_transaction_id="tx_1",
        merchant_name="Starbucks Coffee",
        amount=Decimal("4.00"),
        roundup_amount=Decimal("50.00"),
        transaction_date=date.today(),
        status="Pending",
    )
    db.add(tx)
    db.commit()

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        # Trigger daily job to process pending transactions and update milestones
        response = client.post("/api/v1/roundups/trigger-daily-job")
        assert response.status_code == 200

        # Fetch milestones
        response = client.get("/api/v1/milestones")
        assert response.status_code == 200
        data = response.json()
        assert data["total_invested"] == 50.00

        # Find the $50 milestone
        m50 = next(m for m in data["milestones"] if m["target_amount"] == 50.00)
        assert m50["is_achieved"] is True
        assert "10 free coffees" in m50["reward_text"]
