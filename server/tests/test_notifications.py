import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import uuid

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_notifications.db"
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


def test_notifications_flow(client, db):
    from server import models

    # Create a test user
    user_id = uuid.uuid4()
    user = models.User(
        id=user_id,
        login_id="test_user",
        mobile_number="1234567890",
        hashed_password="hashed",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer",
    )
    db.add(user)
    db.commit()

    # Create a pending notification
    notification_id = uuid.uuid4()
    notification = models.Notification(
        id=notification_id,
        transaction_id="TXN-1001",
        user_id=user_id,
        amount=2500.00,
        merchant="Best Buy",
        status="PENDING",
    )
    db.add(notification)
    db.commit()

    # 1. List notifications
    response = client.get("/api/v1/notifications")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["transaction_id"] == "TXN-1001"
    assert data["items"][0]["amount"] == 2500.00
    assert data["items"][0]["merchant"] == "Best Buy"
    assert data["items"][0]["status"] == "PENDING"

    # 2. Approve transaction
    response = client.post(
        "/api/v1/transaction-responses",
        json={
            "decision": "APPROVE",
            "notification_id": str(notification_id),
            "transaction_id": "TXN-1001",
        },
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # 3. Verify status updated to APPROVED
    response = client.get("/api/v1/notifications")
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["status"] == "APPROVED"

    # 4. Try to action again (should fail with 409)
    response = client.post(
        "/api/v1/transaction-responses",
        json={
            "decision": "BLOCK",
            "notification_id": str(notification_id),
            "transaction_id": "TXN-1001",
        },
    )
    assert response.status_code == 409
    assert "already been actioned" in response.json()["detail"]


def test_unauthorized_notifications(client):
    # No users in DB -> should raise 401
    response = client.get("/api/v1/notifications")
    assert response.status_code == 401
    assert "Unauthorized" in response.json()["detail"]
