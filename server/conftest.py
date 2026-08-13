import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db, seed_data
from server.main import app
from server import models
from server.auth import create_access_token

# Single shared SQLite in-memory test engine
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    # Import models so they register on Base
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def user_token_headers():
    access_token = create_access_token(
        data={"sub": "test@example.com", "role": "RENTER"}
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def admin_token_headers():
    access_token = create_access_token(
        data={"sub": "admin@example.com", "role": "ADMIN"}
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def sample_equipment(db_session):
    eq = (
        db_session.query(models.Equipment)
        .filter(models.Equipment.category == "CAMERAS")
        .first()
    )
    if not eq:
        eq = models.Equipment(
            name="Test Sony Camera",
            category="CAMERAS",
            daily_rate=50.0,
            deposit_amount=100.0,
            status="AVAILABLE",
            specifications={"4k": True},
            version=1,
        )
        db_session.add(eq)
        db_session.commit()
        db_session.refresh(eq)
    return eq
