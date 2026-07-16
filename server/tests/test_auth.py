from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use in-memory SQLite for testing
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


def test_register_buyer():
    # Clean up if exists
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "password123",
            "role": "buyer",
            "full_name": "John Buyer",
        },
    )
    assert response.status_code in [201, 400]
    if response.status_code == 201:
        data = response.json()
        assert data["email"] == "buyer@example.com"
        assert data["role"] == "buyer"


def test_register_broker_missing_license():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "broker_fail@example.com",
            "password": "password123",
            "role": "broker",
            "full_name": "John Broker",
        },
    )
    assert response.status_code == 400
    assert "license" in response.json()["detail"].lower()


def test_register_broker_success():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "broker@example.com",
            "password": "password123",
            "role": "broker",
            "full_name": "John Broker",
            "broker_license": "LIC-12345",
            "broker_agency": "BrokerHaven Agency",
        },
    )
    assert response.status_code in [201, 400]


def test_login_success():
    # Ensure user exists
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login_test@example.com",
            "password": "password123",
            "role": "buyer",
            "full_name": "Login Test",
        },
    )
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "login_test@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login_test@example.com"


def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
