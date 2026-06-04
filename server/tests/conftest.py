import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..database import Base
from ..main import app
from ..dependencies import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

enfine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=enfine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=enfine)
    yield
    Base.metadata.drop_all(bind=enfine)

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
