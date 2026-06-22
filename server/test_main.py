import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to the Greetings of India API" in response.json()["message"]


def test_get_greetings():
    response = client.get("/api/v1/greetings")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5

    # Check fields of the first greeting
    first_greeting = data[0]
    assert "id" in first_greeting
    assert "greeting" in first_greeting
    assert "region" in first_greeting
    assert "description" in first_greeting
    assert "created_at" in first_greeting
    assert "updated_at" in first_greeting


def test_get_greetings_pagination():
    # Get all greetings first
    response_all = client.get("/api/v1/greetings")
    all_greetings = response_all.json()

    # Test limit
    response_limit = client.get("/api/v1/greetings?limit=2")
    assert response_limit.status_code == 200
    data_limit = response_limit.json()
    assert len(data_limit) == 2
    assert data_limit[0]["id"] == all_greetings[0]["id"]
    assert data_limit[1]["id"] == all_greetings[1]["id"]

    # Test skip
    response_skip = client.get("/api/v1/greetings?skip=1&limit=2")
    assert response_skip.status_code == 200
    data_skip = response_skip.json()
    assert len(data_skip) == 2
    assert data_skip[0]["id"] == all_greetings[1]["id"]
    assert data_skip[1]["id"] == all_greetings[2]["id"]
