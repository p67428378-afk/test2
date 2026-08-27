import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db, seed_data
from server.main import app
from server.routers.auth import create_access_token
from server.models.user import User

# In-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_data(session)
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db):
    user = db.query(User).filter(User.email == "admin@example.com").first()
    return user


@pytest.fixture
def donor_user(db):
    user = db.query(User).filter(User.email == "test@example.com").first()
    return user


@pytest.fixture
def admin_headers(admin_user):
    token = create_access_token(data={"sub": admin_user.id, "role": "Admin"})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def donor_headers(donor_user):
    token = create_access_token(data={"sub": donor_user.id, "role": "Donor"})
    return {"Authorization": f"Bearer {token}"}
