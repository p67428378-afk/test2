from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import uuid

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
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


def test_register_user():
    email = f"test_{uuid.uuid4().hex}@example.com"
    response = client.post(
        "/api/v1/users/register",
        json={"email": email, "master_password": "testpassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert "id" in data


def test_register_duplicate_user():
    email = f"duplicate_{uuid.uuid4().hex}@example.com"
    # First registration
    client.post(
        "/api/v1/users/register",
        json={"email": email, "master_password": "testpassword123"},
    )
    # Duplicate registration
    response = client.post(
        "/api/v1/users/register",
        json={"email": email, "master_password": "testpassword123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_user():
    email = f"login_{uuid.uuid4().hex}@example.com"
    client.post(
        "/api/v1/users/register",
        json={"email": email, "master_password": "testpassword123"},
    )
    response = client.post(
        "/api/v1/users/login",
        json={"email": email, "master_password": "testpassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/users/login",
        json={"email": "nonexistent@example.com", "master_password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or master password"
