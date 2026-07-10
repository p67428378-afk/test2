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


@pytest.fixture(scope="function")
def auth_headers(client):
    client.post(
        "/api/v1/users/register",
        json={"email": "user@example.com", "master_password": "strongpassword123"},
    )
    login_resp = client.post(
        "/api/v1/users/login",
        json={"email": "user@example.com", "master_password": "strongpassword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_credential(client, auth_headers):
    response = client.post(
        "/api/v1/credentials",
        json={"encrypted_data": "some_encrypted_blob"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["encrypted_data"] == "some_encrypted_blob"
    cred_id = data["id"]

    get_resp = client.get("/api/v1/credentials", headers=auth_headers)
    assert get_resp.status_code == 200
    items = get_resp.json()
    assert len(items) == 1
    assert items[0]["id"] == cred_id


def test_update_credential(client, auth_headers):
    response = client.post(
        "/api/v1/credentials", json={"encrypted_data": "old_blob"}, headers=auth_headers
    )
    cred_id = response.json()["id"]

    update_resp = client.put(
        f"/api/v1/credentials/{cred_id}",
        json={"encrypted_data": "new_blob"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["encrypted_data"] == "new_blob"


def test_delete_credential(client, auth_headers):
    response = client.post(
        "/api/v1/credentials",
        json={"encrypted_data": "to_delete"},
        headers=auth_headers,
    )
    cred_id = response.json()["id"]

    del_resp = client.delete(f"/api/v1/credentials/{cred_id}", headers=auth_headers)
    assert del_resp.status_code == 200

    get_resp = client.get("/api/v1/credentials", headers=auth_headers)
    assert len(get_resp.json()) == 0


def test_generate_password(client):
    response = client.post(
        "/api/v1/generate-password", json={"length": 20, "include_symbols": True}
    )
    assert response.status_code == 200
    assert len(response.json()["password"]) == 20


def test_import_export_vault(client, auth_headers):
    csv_data = (
        "title,url,username,password,notes\nGoogle,https://google.com,user,pass,note"
    )
    import_resp = client.post(
        "/api/v1/vault/import", json={"csv_data": csv_data}, headers=auth_headers
    )
    assert import_resp.status_code == 200
    assert import_resp.json()["imported_count"] == 1

    export_resp = client.get("/api/v1/vault/export", headers=auth_headers)
    assert export_resp.status_code == 200
    assert "Google" in export_resp.json()["csv_data"]
