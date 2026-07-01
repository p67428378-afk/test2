import os
import pytest
from fastapi.testclient import TestClient

# Set testing environment variable before importing app
os.environ["TESTING"] = "true"

from server.app.main import app
from server.app.database import Base, engine, SessionLocal


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client():
    with TestClient(app) as c:
        yield c
