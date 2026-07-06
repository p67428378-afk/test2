"""
conftest.py — shared pytest fixtures for the electricity monitoring platform.

Uses a single in-memory SQLite engine with StaticPool so all connections
(fixture setup and test requests) share the exact same in-memory database.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db
from server.main import app  # noqa: F401 — ensures all models are registered on Base.metadata

# Import all models so Base.metadata knows every table
from server.models import (  # noqa: F401
    User,
    EnergySource,
    RealtimeMetric,
    HistoricalMetric,
    Alert,
    ServiceRequest,
)

# Shared in-memory engine — StaticPool ensures every call to connect()
# returns the SAME underlying connection, so fixtures and requests see the same data.
TEST_ENGINE = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=TEST_ENGINE)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def reset_db():
    """
    Drop and recreate all tables before each test for full isolation.
    Sets the shared in-memory DB as the get_db dependency for the duration
    of each test, then clears overrides after.
    """
    Base.metadata.drop_all(bind=TEST_ENGINE)
    Base.metadata.create_all(bind=TEST_ENGINE)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def db_session():
    """Provide a database session for seeding data in tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
