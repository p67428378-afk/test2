import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server.routers.auth import active_deks

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()
    Base.metadata.drop_all(bind=engine)
    active_deks.clear()


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_register_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_register_duplicate_email(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "anotherpassword"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_register_password_too_short(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "short"},
    )
    assert response.status_code == 422


def test_login_success(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "master_password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_account_lockout(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    # 5 failed attempts
    for _ in range(5):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "master_password": "wrongpassword"},
        )
        assert response.status_code == 401

    # 6th attempt should be locked out (403)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "master_password": "wrongpassword"},
    )
    assert response.status_code == 403
    assert "locked" in response.json()["detail"]
