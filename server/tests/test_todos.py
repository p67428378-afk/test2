from fastapi.testclient import TestClient

def test_create_todo(client: TestClient):
    response = client.post("/api/v1/todos", json={"title": "Test Todo"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert "id" in data
    assert "created_at" in data

def test_create_todo_empty_title(client: TestClient):
    response = client.post("/api/v1/todos", json={"title": ""})
    assert response.status_code == 422

def test_read_todos(client: TestClient):
    client.post("/api/v1/todos", json={"title": "Test Todo 1"})
    client.post("/api/v1/todos", json={"title": "Test Todo 2"})
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Test Todo 2"
    assert data[1]["title"] == "Test Todo 1"
