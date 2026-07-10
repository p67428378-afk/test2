import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def run_around_tests():
    # Clear database before each test
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield


def test_create_task():
    response = client.post("/api/v1/tasks", json={"text": "Buy groceries"})
    assert response.status_code == 201
    data = response.json()
    assert data["text"] == "Buy groceries"
    assert data["is_completed"] is False
    assert "id" in data
    assert "position" in data


def test_create_task_empty_text():
    response = client.post("/api/v1/tasks", json={"text": ""})
    assert response.status_code == 422


def test_get_tasks():
    client.post("/api/v1/tasks", json={"text": "Task 1"})
    client.post("/api/v1/tasks", json={"text": "Task 2"})

    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["text"] == "Task 1"
    assert data[1]["text"] == "Task 2"


def test_update_task():
    create_resp = client.post("/api/v1/tasks", json={"text": "Original Task"})
    task_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/tasks/{task_id}", json={"text": "Updated Task", "is_completed": True}
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["text"] == "Updated Task"
    assert data["is_completed"] is True


def test_update_task_not_found():
    random_uuid = str(uuid.uuid4())
    response = client.put(f"/api/v1/tasks/{random_uuid}", json={"text": "Updated Task"})
    assert response.status_code == 404


def test_delete_task():
    create_resp = client.post("/api/v1/tasks", json={"text": "To Delete"})
    task_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/v1/tasks/{task_id}")
    assert delete_resp.status_code == 204

    get_resp = client.get("/api/v1/tasks")
    assert len(get_resp.json()) == 0


def test_delete_task_not_found():
    random_uuid = str(uuid.uuid4())
    response = client.delete(f"/api/v1/tasks/{random_uuid}")
    assert response.status_code == 404


def test_reorder_tasks():
    t1 = client.post("/api/v1/tasks", json={"text": "Task 1"}).json()
    t2 = client.post("/api/v1/tasks", json={"text": "Task 2"}).json()

    # Reorder them
    reorder_resp = client.put(
        "/api/v1/tasks/reorder", json={"task_ids": [t2["id"], t1["id"]]}
    )
    assert reorder_resp.status_code == 200

    get_resp = client.get("/api/v1/tasks")
    data = get_resp.json()
    assert data[0]["id"] == t2["id"]
    assert data[1]["id"] == t1["id"]
