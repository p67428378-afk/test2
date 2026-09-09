import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db, seed_data
from server.models import User, Species, UserPlant, PlantHealthLog, CareLog  # noqa: F401
from server.main import app
from server.middleware.auth import create_access_token

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


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def auth_headers(db_session):
    user = db_session.query(User).filter(User.email == "test@example.com").first()
    if not user:
        seed_data(db_session)
        user = db_session.query(User).filter(User.email == "test@example.com").first()

    token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def admin_headers(db_session):
    admin = db_session.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        seed_data(db_session)
        admin = db_session.query(User).filter(User.email == "admin@example.com").first()

    token = create_access_token(
        data={"sub": admin.id, "email": admin.email, "role": admin.role}
    )
    return {"Authorization": f"Bearer {token}"}
