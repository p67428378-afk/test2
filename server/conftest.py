"""
Module: server.conftest
Purpose: Pytest configuration and shared fixtures using the canonical database engine
Author: Backend Developer Agent
Created: 2026-08-21
"""

import os
import pytest
from fastapi.testclient import TestClient

# Force DATABASE_URL to in-memory SQLite for tests before importing database module
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from server.database import Base, engine, SessionLocal, get_db
from server.main import app


@pytest.fixture(scope="session", autouse=True)
def _create_schema_once():
    """
    Create database schema once for the entire test session.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def _clean_tables():
    """
    Function-scoped: wipe DATA (not schema) between tests so state doesn't leak.
    """
    yield
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())


def _override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture
def client():
    """
    Fixture to provide a TestClient instance.
    """
    with TestClient(app) as c:
        yield c
