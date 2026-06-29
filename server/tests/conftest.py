"""
Module: server.tests.conftest
Purpose: Pytest configuration and fixtures.
"""

import os
import sys

# Force test environment variables before any other imports
os.environ["TESTING"] = "True"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "supersecretkeyfortestingonly"

# Add repo root to sys.path to ensure imports work correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db
from server.main import app
from server.models.user import User
from server.routers.auth import get_password_hash, create_access_token

# Create a single in-memory SQLite engine with StaticPool for test isolation
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db():
    """
    Function-scoped database session fixture.
    Creates all tables before each test and drops them after.
    """
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db):
    """
    TestClient fixture with overridden get_db dependency.
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
def customer_token(db):
    """
    Fixture to create a test customer and return their JWT token.
    """
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="customer@example.com",
        full_name="Test Customer",
        hashed_password=hashed_password,
        role="customer",
        phone="1234567890",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return f"Bearer {token}"


@pytest.fixture(scope="function")
def restaurant_token(db):
    """
    Fixture to create a test restaurant partner and return their JWT token.
    """
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="restaurant_partner@example.com",
        full_name="Test Restaurant Partner",
        hashed_password=hashed_password,
        role="restaurant",
        phone="1234567891",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return f"Bearer {token}"


@pytest.fixture(scope="function")
def driver_token(db):
    """
    Fixture to create a test delivery partner and return their JWT token.
    """
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="driver_partner@example.com",
        full_name="Test Delivery Partner",
        hashed_password=hashed_password,
        role="delivery",
        phone="1234567892",
        is_online=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return f"Bearer {token}"


@pytest.fixture(scope="function")
def admin_token(db):
    """
    Fixture to create a test administrator and return their JWT token.
    """
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="admin_user@example.com",
        full_name="Test Administrator",
        hashed_password=hashed_password,
        role="admin",
        phone="1234567893",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return f"Bearer {token}"
