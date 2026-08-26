import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

    api_response = client.get("/api/v1/health")
    assert api_response.status_code == 200
    assert api_response.json()["status"] == "ok"


def test_create_todo_success(client: TestClient):
    payload = {
        "title": "Buy Groceries",
        "description": "Milk, Eggs, Bread",
    }
    response = client.post("/api/v1/todos", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy Groceries"
    assert data["description"] == "Milk, Eggs, Bread"
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_todo_without_description(client: TestClient):
    payload = {"title": "Call Plumber"}
    response = client.post("/api/v1/todos", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Call Plumber"
    assert data["description"] is None
    assert data["completed"] is False


def test_create_todo_validation_error(client: TestClient):
    # Missing required title
    response = client.post("/api/v1/todos", json={"description": "No title here"})
    assert response.status_code == 422

    # Empty string title
    response_empty = client.post("/api/v1/todos", json={"title": ""})
    assert response_empty.status_code == 422


def test_list_todos_and_pagination(client: TestClient):
    # Create 3 items
    client.post("/api/v1/todos", json={"title": "Task 1"})
    client.post("/api/v1/todos", json={"title": "Task 2"})
    client.post("/api/v1/todos", json={"title": "Task 3"})

    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

    # Test limit and skip
    response_paged = client.get("/api/v1/todos?skip=1&limit=2")
    assert response_paged.status_code == 200
    paged_data = response_paged.json()
    assert len(paged_data) <= 2


def test_list_todos_filter_by_completed(client: TestClient):
    create_res1 = client.post("/api/v1/todos", json={"title": "Pending Item"})
    todo1_id = create_res1.json()["id"]

    create_res2 = client.post("/api/v1/todos", json={"title": "Done Item"})
    todo2_id = create_res2.json()["id"]
    client.put(f"/api/v1/todos/{todo2_id}", json={"completed": True})

    # Filter completed=true
    res_completed = client.get("/api/v1/todos?completed=true")
    assert res_completed.status_code == 200
    completed_items = res_completed.json()
    assert any(item["id"] == todo2_id for item in completed_items)
    assert all(item["completed"] is True for item in completed_items)

    # Filter completed=false
    res_pending = client.get("/api/v1/todos?completed=false")
    assert res_pending.status_code == 200
    pending_items = res_pending.json()
    assert any(item["id"] == todo1_id for item in pending_items)
    assert all(item["completed"] is False for item in pending_items)


def test_get_todo_by_id(client: TestClient):
    create_res = client.post("/api/v1/todos", json={"title": "Get Single Item", "description": "Details"})
    todo_id = create_res.json()["id"]

    response = client.get(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == "Get Single Item"
    assert data["description"] == "Details"


def test_get_todo_not_found(client: TestClient):
    response = client.get("/api/v1/todos/non-existent-uuid")
    assert response.status_code == 404
    assert response.json()["detail"] == "TODO item not found"


def test_update_todo_success(client: TestClient):
    create_res = client.post("/api/v1/todos", json={"title": "Original Title", "description": "Original Desc"})
    todo_id = create_res.json()["id"]

    update_payload = {
        "title": "Updated Title",
        "description": "Updated Description",
        "completed": True,
    }
    response = client.put(f"/api/v1/todos/{todo_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated Description"
    assert data["completed"] is True


def test_update_todo_partial(client: TestClient):
    create_res = client.post("/api/v1/todos", json={"title": "Keep Title", "description": "Keep Desc"})
    todo_id = create_res.json()["id"]

    # Update only status
    response = client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Keep Title"
    assert data["description"] == "Keep Desc"
    assert data["completed"] is True


def test_update_todo_not_found(client: TestClient):
    response = client.put("/api/v1/todos/non-existent-uuid", json={"title": "New"})
    assert response.status_code == 404
    assert response.json()["detail"] == "TODO item not found"


def test_delete_todo_success(client: TestClient):
    create_res = client.post("/api/v1/todos", json={"title": "Item to Delete"})
    todo_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/v1/todos/{todo_id}")
    assert delete_res.status_code == 204

    # Verify item is gone
    get_res = client.get(f"/api/v1/todos/{todo_id}")
    assert get_res.status_code == 404


def test_delete_todo_not_found(client: TestClient):
    response = client.delete("/api/v1/todos/non-existent-uuid")
    assert response.status_code == 404
    assert response.json()["detail"] == "TODO item not found"
