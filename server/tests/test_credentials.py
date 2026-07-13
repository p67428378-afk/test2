import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server.routers.auth import active_deks

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


@pytest.fixture(scope="function")
def auth_headers(client):
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "master_password": "testpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_credential(client, auth_headers):
    # Create credential
    response = client.post(
        "/api/v1/credentials",
        json={
            "title": "Google Account",
            "username": "user@gmail.com",
            "password": "supersecretpassword",
            "url": "https://google.com",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Google Account"
    assert data["username"] == "user@gmail.com"
    assert data["password"] == "supersecretpassword"
    assert data["url"] == "https://google.com"
    assert "id" in data

    # Get credentials
    response = client.get("/api/v1/credentials", headers=auth_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["title"] == "Google Account"
    assert items[0]["password"] == "supersecretpassword"


def test_update_credential(client, auth_headers):
    # Create credential
    create_resp = client.post(
        "/api/v1/credentials",
        json={
            "title": "Google Account",
            "username": "user@gmail.com",
            "password": "supersecretpassword",
            "url": "https://google.com",
        },
        headers=auth_headers,
    )
    cred_id = create_resp.json()["id"]

    # Update credential
    update_resp = client.put(
        f"/api/v1/credentials/{cred_id}",
        json={"title": "Google Updated", "password": "newpassword"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["title"] == "Google Updated"
    assert data["password"] == "newpassword"
    assert data["username"] == "user@gmail.com"  # Unchanged


def test_delete_credential(client, auth_headers):
    # Create credential
    create_resp = client.post(
        "/api/v1/credentials",
        json={
            "title": "Google Account",
            "username": "user@gmail.com",
            "password": "supersecretpassword",
            "url": "https://google.com",
        },
        headers=auth_headers,
    )
    cred_id = create_resp.json()["id"]

    # Delete credential
    delete_resp = client.delete(f"/api/v1/credentials/{cred_id}", headers=auth_headers)
    assert delete_resp.status_code == 200
    assert delete_resp.json()["success"] is True

    # Verify deleted
    get_resp = client.get("/api/v1/credentials", headers=auth_headers)
    assert len(get_resp.json()) == 0
