import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

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


def test_register_user(client):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "newuser@example.com", "master_password": "strongpassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_register_duplicate_user(client):
    client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "master_password": "strongpassword123"},
    )
    response = client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "master_password": "strongpassword123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_user(client):
    client.post(
        "/api/v1/users/register",
        json={"email": "login@example.com", "master_password": "strongpassword123"},
    )
    response = client.post(
        "/api/v1/users/login",
        json={"email": "login@example.com", "master_password": "strongpassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "derived_key_salt" in data
