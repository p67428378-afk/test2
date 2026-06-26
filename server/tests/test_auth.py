import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine, SessionLocal, get_db
from server import models
import uuid

# Create tables on the shared engine
Base.metadata.create_all(bind=engine)

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_overrides():
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture(autouse=True)
def clean_db():
    db = SessionLocal()
    try:
        db.query(models.Loan).delete()
        db.query(models.BookCopy).delete()
        db.query(models.Book).delete()
        db.query(models.User).delete()
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


def test_register_user():
    username = f"user_{uuid.uuid4().hex[:8]}"
    email = f"{username}@example.com"
    response = client.post(
        "/api/v1/users/register",
        json={
            "username": username,
            "email": email,
            "password": "testpassword",
            "role": "member",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == username
    assert data["email"] == email
    assert data["role"] == "member"
    assert "id" in data


def test_register_duplicate_username():
    username = f"user_{uuid.uuid4().hex[:8]}"
    email1 = f"{username}1@example.com"
    email2 = f"{username}2@example.com"

    # First registration
    response = client.post(
        "/api/v1/users/register",
        json={
            "username": username,
            "email": email1,
            "password": "testpassword",
            "role": "member",
        },
    )
    assert response.status_code == 201

    # Duplicate username registration
    response = client.post(
        "/api/v1/users/register",
        json={
            "username": username,
            "email": email2,
            "password": "testpassword",
            "role": "member",
        },
    )
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]


def test_login_user():
    username = f"user_{uuid.uuid4().hex[:8]}"
    email = f"{username}@example.com"

    # Register
    client.post(
        "/api/v1/users/register",
        json={
            "username": username,
            "email": email,
            "password": "testpassword",
            "role": "member",
        },
    )

    # Login success
    response = client.post(
        "/api/v1/users/login", json={"username": username, "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == username

    # Login failure
    response = client.post(
        "/api/v1/users/login", json={"username": username, "password": "wrongpassword"}
    )
    assert response.status_code == 401
