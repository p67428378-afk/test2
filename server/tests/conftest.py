import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

os.environ["TESTING"] = "true"

from server.models import Base
from server.database import get_db, seed_data
from server.main import app
from server.auth import create_access_token

# SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def seed_db_each_test():
    db = TestingSessionLocal()
    seed_data(db)
    db.close()


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    def _override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def employee_headers():
    token = create_access_token(
        data={"sub": "test@example.com", "role": "ROLE_EMPLOYEE"}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def expert_headers():
    token = create_access_token(
        data={"sub": "admin@example.com", "role": "ROLE_EXPERT"}
    )
    return {"Authorization": f"Bearer {token}"}
