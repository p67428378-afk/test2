import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import server.models as models  # noqa: F401
from server.database import Base, get_db, seed_data, engine
from server.main import app

# Shared SQLite in-memory engine for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create all tables and seed initial data for the test session."""
    Base.metadata.create_all(bind=engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def _apply_test_db_override():
    """Ensure app.dependency_overrides points to the test session for all tests in server/tests/."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        import database

        app.dependency_overrides[database.get_db] = override_get_db
    except ImportError:
        pass
    yield


@pytest.fixture
def client():
    """TestClient fixture with lifespan context enabled."""
    with TestClient(app) as c:
        yield c


@pytest.fixture
def db_session():
    """Database session fixture for tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
