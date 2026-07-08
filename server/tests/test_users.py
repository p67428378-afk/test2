import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models

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


def test_get_roundup_settings(db):
    # Seed a user
    user = models.User(email="test@example.com", is_roundup_enabled=False)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Seed a linked account
    linked_acc = models.LinkedAccount(
        user_id=user.id,
        plaid_access_token="mock_plaid_token_123",
        account_name="Primary Debit Card",
    )
    db.add(linked_acc)
    db.commit()

    # Override get_db
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        response = client.get("/api/v1/users/me/roundup-settings")
        assert response.status_code == 200
        data = response.json()
        assert data["is_roundup_enabled"] is False
        assert data["linked_account_id"] == str(linked_acc.id)


def test_update_roundup_settings(db):
    # Seed a user
    user = models.User(email="test@example.com", is_roundup_enabled=False)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Override get_db
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        response = client.put(
            "/api/v1/users/me/roundup-settings", json={"is_roundup_enabled": True}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_roundup_enabled"] is True

        # Verify in DB
        db.refresh(user)
        assert user.is_roundup_enabled is True
