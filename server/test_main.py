
import sys
sys.path.insert(0, '.')
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app, get_db
from server.database import Base
import pytest

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


def test_create_task():
    response = client.post("/api/v1/todos", json={"title": "Test Task"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert "id" in data


def test_read_tasks():
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_read_task():
    response = client.post("/api/v1/todos", json={"title": "Test Task for Reading"})
    task_id = response.json()["id"]
    response = client.get(f"/api/v1/todos/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task for Reading"


def test_update_task():
    response = client.post("/api/v1/todos", json={"title": "Test Task for Updating"})
    task_id = response.json()["id"]
    response = client.put(f"/api/v1/todos/{task_id}", json={"title": "Updated Task", "completed": True})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["completed"] is True


def test_delete_task():
    response = client.post("/api/v1/todos", json={"title": "Test Task for Deleting"})
    task_id = response.json()["id"]
    response = client.delete(f"/api/v1/todos/{task_id}")
    assert response.status_code == 204
    response = client.get(f"/api/v1/todos/{task_id}")
    assert response.status_code == 404
