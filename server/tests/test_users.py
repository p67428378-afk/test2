
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_register_user(db_session):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "test@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "user_id" in data

    response = client.post(
        "/api/v1/users/register",
        json={"email": "test@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    assert response.status_code == 409

def test_read_user(db_session):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "test2@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]

    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test2@example.com"

    response = client.get(f"/api/v1/users/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
