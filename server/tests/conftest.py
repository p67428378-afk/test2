"""
Module: conftest
Purpose: Pytest fixtures for database and client setup.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.database import Base, get_db
from server.app.main import app
from server.app.crud import get_password_hash

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """
    Create a fresh database for each test function.
    """
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """
    Create a TestClient with database dependency override.
    """

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db):
    """
    Create a standard customer user.
    """
    from server.app.models import User

    user = User(
        email="customer@example.com",
        name="Customer User",
        password_hash=get_password_hash("password123"),
        role="customer",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def admin_user(db):
    """
    Create an admin user.
    """
    from server.app.models import User

    user = User(
        email="admin_test@example.com",
        name="Admin User",
        password_hash=get_password_hash("admin123"),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def user_token(client, test_user):
    """
    Get JWT token for standard user.
    """
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@example.com", "password": "password123"},
    )
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def admin_token(client, admin_user):
    """
    Get JWT token for admin user.
    """
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin_test@example.com", "password": "admin123"},
    )
    return response.json()["access_token"]
