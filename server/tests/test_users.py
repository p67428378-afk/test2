import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.app.main import app
from server.database import Base, get_db
from server.app.api.v1.users import rate_limit_store

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


@pytest.fixture(autouse=True)
def setup_and_teardown():
    # Clear rate limit store
    rate_limit_store.clear()
    # Clear tables before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


def test_register_user_success():
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["email"] == "john.doe@example.com"
    assert data["message"] == "User registered successfully."


def test_register_user_validation_error():
    # Missing fields
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "John",
            "email": "john.doe@example.com",
            "password": "securepassword123",
        },
    )
    assert response.status_code == 422

    # Password too short
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "short",
        },
    )
    assert response.status_code == 422

    # Invalid email
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "invalid-email",
            "password": "securepassword123",
        },
    )
    assert response.status_code == 422


def test_register_user_duplicate_email():
    # Register first user
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword123",
        },
    )
    assert response.status_code == 201

    # Register second user with same email
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "anotherpassword123",
        },
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "The email address is already registered."


def test_register_user_rate_limiting():
    # Send 5 requests successfully
    for i in range(5):
        response = client.post(
            "/api/v1/users",
            json={
                "first_name": f"User{i}",
                "last_name": "Test",
                "email": f"user{i}@example.com",
                "password": "securepassword123",
            },
        )
        assert response.status_code == 201

    # 6th request should be rate limited
    response = client.post(
        "/api/v1/users",
        json={
            "first_name": "User6",
            "last_name": "Test",
            "email": "user6@example.com",
            "password": "securepassword123",
        },
    )
    assert response.status_code == 429
    assert response.json()["detail"] == "Too many requests. Please try again later."
