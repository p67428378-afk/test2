import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server import models  # Ensure models are registered
from server.main import app

# Use a physical SQLite file for testing to persist tables across connections
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tasks.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_database():
    # Create tables on the test database
    Base.metadata.create_all(bind=engine)
    
    # Override get_db dynamically during test execution
    app.dependency_overrides[get_db] = override_get_db
    yield
    # Clean up override and tables
    if get_db in app.dependency_overrides:
        del app.dependency_overrides[get_db]
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_create_task():
    response = client.post("/api/v1/tasks", json={"description": "Test Task"})
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Test Task"
    assert data["completed"] is False
    assert "id" in data

def test_create_task_empty_description():
    response = client.post("/api/v1/tasks", json={"description": ""})
    assert response.status_code in [400, 422]

def test_read_tasks():
    # Create a task first
    client.post("/api/v1/tasks", json={"description": "Task 1"})
    client.post("/api/v1/tasks", json={"description": "Task 2"})

    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["description"] == "Task 1"
    assert data[1]["description"] == "Task 2"

def test_read_task_by_id():
    create_response = client.post("/api/v1/tasks", json={"description": "Task to find"})
    task_id = create_response.json()["id"]

    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["description"] == "Task to find"

def test_read_task_not_found():
    response = client.get("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404

def test_update_task():
    create_response = client.post("/api/v1/tasks", json={"description": "Original Task"})
    task_id = create_response.json()["id"]

    response = client.put(f"/api/v1/tasks/{task_id}", json={"description": "Updated Task", "completed": True})
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Updated Task"
    assert data["completed"] is True

def test_update_task_not_found():
    response = client.put("/api/v1/tasks/00000000-0000-0000-0000-000000000000", json={"description": "Updated Task"})
    assert response.status_code == 404

def test_delete_task():
    create_response = client.post("/api/v1/tasks", json={"description": "Task to delete"})
    task_id = create_response.json()["id"]

    response = client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200

    # Verify it's deleted
    get_response = client.get(f"/api/v1/tasks/{task_id}")
    assert get_response.status_code == 404

def test_delete_task_not_found():
    response = client.delete("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
