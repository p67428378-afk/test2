import uuid
from fastapi import status


def test_health_check(client):
    """Verify the health check endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "todo-api"


def test_create_todo_with_description(client):
    """Test creating a new todo item with both title and description."""
    payload = {"title": "Buy groceries", "description": "Milk, eggs, bread"}
    response = client.post("/api/v1/todos", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["title"] == "Buy groceries"
    assert data["description"] == "Milk, eggs, bread"
    assert data["completed"] is False
    assert "created_at" in data
    assert "updated_at" in data


def test_create_todo_title_only(client):
    """Test creating a new todo item with only a title."""
    payload = {"title": "Finish report"}
    response = client.post("/api/v1/todos", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "Finish report"
    assert data["description"] is None
    assert data["completed"] is False


def test_create_todo_empty_title_validation(client):
    """Test creating a todo item with empty title returns 422 Unprocessable Entity."""
    payload = {"title": ""}
    response = client.post("/api/v1/todos", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_todos_list(client):
    """Test retrieving list of all todo items sorted by created_at desc."""
    # Create 2 items
    client.post("/api/v1/todos", json={"title": "Task 1", "description": "Desc 1"})
    client.post("/api/v1/todos", json={"title": "Task 2", "description": "Desc 2"})

    response = client.get("/api/v1/todos")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    titles = [item["title"] for item in data]
    assert "Task 1" in titles
    assert "Task 2" in titles


def test_get_todo_by_id_success(client):
    """Test retrieving a single todo item by ID."""
    create_res = client.post(
        "/api/v1/todos", json={"title": "Single Item", "description": "Details"}
    )
    created_id = create_res.json()["id"]

    response = client.get(f"/api/v1/todos/{created_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == created_id
    assert data["title"] == "Single Item"
    assert data["description"] == "Details"


def test_get_todo_by_id_not_found(client):
    """Test retrieving a non-existent todo item returns 404."""
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/todos/{random_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "not found" in response.json()["detail"].lower()


def test_update_todo_details(client):
    """Test updating title and description of a todo item."""
    create_res = client.post(
        "/api/v1/todos",
        json={"title": "Original Title", "description": "Original Desc"},
    )
    todo_id = create_res.json()["id"]

    update_payload = {"title": "Updated Title", "description": "Updated Desc"}
    response = client.put(f"/api/v1/todos/{todo_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated Desc"
    assert data["completed"] is False


def test_update_todo_toggle_completed(client):
    """Test marking a todo item as completed and then incomplete."""
    create_res = client.post("/api/v1/todos", json={"title": "Toggle Task"})
    todo_id = create_res.json()["id"]
    assert create_res.json()["completed"] is False

    # Mark as completed
    response = client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["completed"] is True

    # Mark as incomplete again
    response_uncheck = client.put(f"/api/v1/todos/{todo_id}", json={"completed": False})
    assert response_uncheck.status_code == status.HTTP_200_OK
    assert response_uncheck.json()["completed"] is False


def test_update_todo_not_found(client):
    """Test updating a non-existent todo item returns 404."""
    random_id = str(uuid.uuid4())
    response = client.put(f"/api/v1/todos/{random_id}", json={"title": "Ghost"})
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_todo_success(client):
    """Test permanently deleting a todo item."""
    create_res = client.post("/api/v1/todos", json={"title": "Delete Me"})
    todo_id = create_res.json()["id"]

    # Delete
    del_res = client.delete(f"/api/v1/todos/{todo_id}")
    assert del_res.status_code == status.HTTP_204_NO_CONTENT

    # Verify item is gone
    get_res = client.get(f"/api/v1/todos/{todo_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND


def test_delete_todo_not_found(client):
    """Test deleting a non-existent todo returns 404."""
    random_id = str(uuid.uuid4())
    response = client.delete(f"/api/v1/todos/{random_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_filter_todos_by_status(client):
    """Test filtering todos by completed=true and completed=false."""
    res1 = client.post("/api/v1/todos", json={"title": "Pending Item 1"})
    res2 = client.post("/api/v1/todos", json={"title": "Completed Item 1"})
    client.put(f"/api/v1/todos/{res2.json()['id']}", json={"completed": True})

    # Filter Active (completed=false)
    active_res = client.get("/api/v1/todos?completed=false")
    assert active_res.status_code == status.HTTP_200_OK
    active_items = active_res.json()
    assert all(item["completed"] is False for item in active_items)
    assert any(item["id"] == res1.json()["id"] for item in active_items)
    assert not any(item["id"] == res2.json()["id"] for item in active_items)

    # Filter Completed (completed=true)
    completed_res = client.get("/api/v1/todos?completed=true")
    assert completed_res.status_code == status.HTTP_200_OK
    completed_items = completed_res.json()
    assert all(item["completed"] is True for item in completed_items)
    assert any(item["id"] == res2.json()["id"] for item in completed_items)
    assert not any(item["id"] == res1.json()["id"] for item in completed_items)


def test_search_todos_by_keyword(client):
    """Test search query parameter matching in title or description."""
    client.post(
        "/api/v1/todos",
        json={"title": "Alpha unique task", "description": "Some random text"},
    )
    client.post(
        "/api/v1/todos",
        json={"title": "Beta ordinary task", "description": "Specific keyword in desc"},
    )
    client.post(
        "/api/v1/todos",
        json={"title": "Gamma unrelated", "description": "Unrelated content"},
    )

    # Search title keyword
    search1 = client.get("/api/v1/todos?search=unique")
    assert search1.status_code == status.HTTP_200_OK
    results1 = search1.json()
    assert len(results1) == 1
    assert results1[0]["title"] == "Alpha unique task"

    # Search description keyword
    search2 = client.get("/api/v1/todos?search=Specific")
    assert search2.status_code == status.HTTP_200_OK
    results2 = search2.json()
    assert len(results2) == 1
    assert results2[0]["title"] == "Beta ordinary task"

    # Search non-matching keyword
    search3 = client.get("/api/v1/todos?search=NonExistentPhrase123")
    assert search3.status_code == status.HTTP_200_OK
    assert len(search3.json()) == 0


def test_pagination(client):
    """Test skip and limit pagination parameters."""
    for i in range(5):
        client.post("/api/v1/todos", json={"title": f"Paginated Item {i}"})

    response = client.get("/api/v1/todos?skip=0&limit=2")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 2

    response_skip = client.get("/api/v1/todos?skip=2&limit=2")
    assert response_skip.status_code == status.HTTP_200_OK
    assert len(response_skip.json()) == 2
