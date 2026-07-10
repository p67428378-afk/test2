import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.database import Base, get_db
from server.main import app
from server.models import User, Subscription, Order
from server.auth import get_password_hash, create_access_token
from server.scheduler import run_daily_billing_and_notifications

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
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


@pytest.fixture
def test_user(db):
    hashed_pw = get_password_hash("testpassword")
    user = User(
        login_id="test@example.com",
        email="test@example.com",
        mobile_number="1234567890",
        hashed_password=hashed_pw,
        security_question="What is your favorite chocolate?",
        security_answer_hash=get_password_hash("dark chocolate"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


def test_create_subscription(client, auth_headers, db, test_user):
    payload = {
        "box_size": "Medium",
        "frequency_weeks": 4,
        "payment_method_token": "tok_123",
    }
    response = client.post("/api/v1/subscriptions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["box_size"] == "Medium"
    assert data["frequency_weeks"] == 4
    assert data["status"] == "active"
    assert "next_payment_date" in data


def test_create_subscription_invalid_size(client, auth_headers):
    payload = {
        "box_size": "ExtraLarge",
        "frequency_weeks": 4,
        "payment_method_token": "tok_123",
    }
    response = client.post("/api/v1/subscriptions", json=payload, headers=auth_headers)
    assert response.status_code == 400


def test_get_my_subscription(client, auth_headers, db, test_user):
    # Create subscription first
    sub = Subscription(
        user_id=test_user.id,
        box_size="Large",
        frequency_weeks=6,
        status="active",
        next_payment_date=datetime.utcnow() + timedelta(weeks=6),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()

    response = client.get("/api/v1/subscriptions/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["subscription"]["box_size"] == "Large"
    assert data["subscription"]["frequency_weeks"] == 6


def test_update_subscription_48h_rule(client, auth_headers, db, test_user):
    # Create subscription with next payment date in 24 hours (less than 48h)
    sub = Subscription(
        user_id=test_user.id,
        box_size="Small",
        frequency_weeks=2,
        status="active",
        next_payment_date=datetime.utcnow() + timedelta(hours=24),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()

    payload = {"status": "paused"}
    response = client.patch(
        "/api/v1/subscriptions/me", json=payload, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["applied_immediately"] is False
    assert "current box will still be charged" in data["message"]


def test_update_subscription_outside_48h(client, auth_headers, db, test_user):
    # Create subscription with next payment date in 5 days (more than 48h)
    sub = Subscription(
        user_id=test_user.id,
        box_size="Small",
        frequency_weeks=2,
        status="active",
        next_payment_date=datetime.utcnow() + timedelta(days=5),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()

    payload = {"status": "paused"}
    response = client.patch(
        "/api/v1/subscriptions/me", json=payload, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["applied_immediately"] is True
    assert data["subscription"]["status"] == "paused"


def test_payment_webhook_success(client, db, test_user):
    sub = Subscription(
        user_id=test_user.id,
        box_size="Medium",
        frequency_weeks=4,
        status="active",
        next_payment_date=datetime.utcnow(),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    payload = {
        "subscription_id": str(sub.id),
        "event_type": "payment.succeeded",
        "amount": 40.50,
    }
    response = client.post("/api/v1/webhooks/payment", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

    # Verify order created
    order = db.query(Order).filter(Order.subscription_id == sub.id).first()
    assert order is not None
    assert order.status == "Paid"
    assert float(order.amount) == 40.50


def test_payment_webhook_failure(client, db, test_user):
    sub = Subscription(
        user_id=test_user.id,
        box_size="Medium",
        frequency_weeks=4,
        status="active",
        next_payment_date=datetime.utcnow(),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    payload = {
        "subscription_id": str(sub.id),
        "event_type": "payment.failed",
        "amount": 40.50,
    }
    response = client.post("/api/v1/webhooks/payment", json=payload)
    assert response.status_code == 200

    # Verify order created as Frozen
    order = db.query(Order).filter(Order.subscription_id == sub.id).first()
    assert order is not None
    assert order.status == "Frozen"

    # Verify subscription paused/frozen
    db.refresh(sub)
    assert sub.status == "paused"


def test_scheduler_pre_payment_reminder(db, test_user):
    # Create subscription with next payment date in exactly 5 days
    sub = Subscription(
        user_id=test_user.id,
        box_size="Medium",
        frequency_weeks=4,
        status="active",
        next_payment_date=datetime.utcnow() + timedelta(days=5),
        skip_next=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()

    # Run scheduler
    run_daily_billing_and_notifications(db)
    # The mock email service will print/log the reminder.
