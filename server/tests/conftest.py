import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from server.models import Base, User
from server.database import get_db, seed_data
from server.main import app
from server.app.auth.utils import create_access_token

# Single shared SQLite in-memory engine for test suite
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_data(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_headers(db_session: Session) -> dict:
    admin = db_session.query(User).filter(User.email == "admin@example.com").first()
    token = create_access_token(
        {"sub": admin.id, "email": admin.email, "role": admin.role}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def staff_headers(db_session: Session) -> dict:
    staff = db_session.query(User).filter(User.email == "test@example.com").first()
    token = create_access_token(
        {"sub": staff.id, "email": staff.email, "role": staff.role}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def doctor_headers(db_session: Session) -> dict:
    doctor = db_session.query(User).filter(User.email == "doctor@example.com").first()
    token = create_access_token(
        {"sub": doctor.id, "email": doctor.email, "role": doctor.role}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def patient_headers(db_session: Session) -> dict:
    patient = db_session.query(User).filter(User.email == "patient@example.com").first()
    token = create_access_token(
        {"sub": patient.id, "email": patient.email, "role": patient.role}
    )
    return {"Authorization": f"Bearer {token}"}
