import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.api.v1.endpoints.auth import get_password_hash
from server import models
import uuid

# Use a clean test database for each test run
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_patrons.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Drop and recreate tables to ensure clean state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        # Seed librarian
        hashed_pw = get_password_hash("testpassword")
        new_lib = models.User(
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password=hashed_pw,
            security_question="What is your favorite color?",
            security_answer_hash=hashed_pw,
        )
        db.add(new_lib)
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="module")
def librarian_token():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "is_librarian": True,
            "username": "test@example.com",
            "password": "testpassword",
        },
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_create_patron(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    username = f"patron_{uuid.uuid4().hex[:8]}"
    email = f"{username}@example.com"
    response = client.post(
        "/api/v1/patrons",
        headers=headers,
        json={
            "username": username,
            "email": email,
            "password": "patronpassword",
            "full_name": "John Doe",
            "mobile_number": f"555-{uuid.uuid4().hex[:4]}",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == username
    assert data["email"] == email
    assert "id" in data


def test_get_patrons(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    response = client.get("/api/v1/patrons", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
