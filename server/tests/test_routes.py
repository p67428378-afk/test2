import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.main import app
from server.database import Base, get_db

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_register_initial_schema(client):
    schema_def = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
        ],
    }
    response = client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_def)},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == 1
    assert data["subject"] == "user-events"
    assert data["schema_definition"] == schema_def


def test_register_compatible_schema(client):
    # Register v1
    schema_v1 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v1)},
    )

    # Register v2 (add optional field with default)
    schema_v2 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "session_id", "type": ["null", "string"], "default": None},
        ],
    }
    response = client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v2)},
    )
    assert response.status_code == 200
    assert response.json()["version"] == 2


def test_register_incompatible_schema(client):
    # Register v1
    schema_v1 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v1)},
    )

    # Register v2 (add required field without default)
    schema_v2 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
        ],
    }
    response = client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v2)},
    )
    assert response.status_code == 422
    assert "compatibility check failed" in response.json()["detail"]


def test_get_versions_and_latest(client):
    schema_v1 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v1)},
    )

    # Get all versions
    response = client.get("/api/v1/schemas/user-events/versions")
    assert response.status_code == 200
    assert len(response.json()) == 1

    # Get latest
    response = client.get("/api/v1/schemas/user-events/versions/latest")
    assert response.status_code == 200
    assert response.json()["version"] == 1


def test_get_validation_logs(client):
    schema_v1 = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    client.post(
        "/api/v1/schemas/user-events/versions",
        json={"schema_definition": json.dumps(schema_v1)},
    )

    response = client.get("/api/v1/validation-logs")
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) >= 1
    assert logs[0]["subject"] == "user-events"
    assert logs[0]["status"] == "PASSED"
