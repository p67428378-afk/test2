import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
import uuid

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_todos.db"

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
    # Clear the todos table before each test
    db = TestingSessionLocal()
    db.execute(Base.metadata.tables["todos"].delete())
    db.commit()
    db.close()
    yield


def test_create_todo():
    response = client.post(
        "/api/v1/todos",
        json={"text": "Buy groceries"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["text"] == "Buy groceries"
    assert data["is_completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_todo_invalid():
    response = client.post(
        "/api/v1/todos",
        json={"text": ""},
    )
    assert response.status_code == 422


def test_get_todos():
    # Create two todos
    client.post("/api/v1/todos", json={"text": "Todo 1"})
    client.post("/api/v1/todos", json={"text": "Todo 2"})

    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["text"] == "Todo 1"
    assert data[1]["text"] == "Todo 2"


def test_get_todo_by_id():
    create_resp = client.post("/api/v1/todos", json={"text": "Specific Todo"})
    todo_id = create_resp.json()["id"]

    response = client.get(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json()["text"] == "Specific Todo"


def test_get_todo_not_found():
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/todos/{random_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Todo item not found"


def test_update_todo():
    create_resp = client.post("/api/v1/todos", json={"text": "Original Text"})
    todo_id = create_resp.json()["id"]

    # Update text and is_completed
    response = client.put(
        f"/api/v1/todos/{todo_id}",
        json={"text": "Updated Text", "is_completed": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "Updated Text"
    assert data["is_completed"] is True


def test_update_todo_not_found():
    random_id = str(uuid.uuid4())
    response = client.put(
        f"/api/v1/todos/{random_id}",
        json={"text": "Updated Text"},
    )
    assert response.status_code == 404


def test_delete_todo():
    create_resp = client.post("/api/v1/todos", json={"text": "To be deleted"})
    todo_id = create_resp.json()["id"]

    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Todo item deleted successfully"

    # Verify it is deleted
    get_resp = client.get(f"/api/v1/todos/{todo_id}")
    assert get_resp.status_code == 404
