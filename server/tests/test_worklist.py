# server/tests/test_worklist.py


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_user_registration(client):
    # AC: Security: Implement role-based access control (RBAC) / User registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "full_name": "New User",
            "role": "user",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "user"
    assert "id" in data


def test_user_login(client):
    # AC: Security: Implement role-based access control (RBAC) / User login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"


def test_create_worklist_item(client):
    # AC: POST /api/v1/worklist: Creates a new worklist item.
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.post(
        "/api/v1/worklist",
        json={
            "title": "Test Task",
            "description": "This is a test task",
            "status": "new",
            "priority": 1,
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "new"
    assert data["priority"] == 1
    assert "id" in data


def test_get_worklist_items_pagination_and_filtering(client):
    # AC: GET /api/v1/worklist: Retrieves a paginated list of worklist items.
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create 3 items
    for i in range(3):
        client.post(
            "/api/v1/worklist",
            json={
                "title": f"Task {i}",
                "description": f"Description {i}",
                "status": "new" if i < 2 else "completed",
                "priority": i,
            },
            headers=headers,
        )

    # Get all items
    response = client.get("/api/v1/worklist", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3

    # Filter by status
    response = client.get("/api/v1/worklist?status_filter=completed", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(item["status"] == "completed" for item in data["items"])


def test_update_worklist_item(client):
    # AC: PUT /api/v1/worklist/{item_id}: Updates an existing worklist item's status or details.
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create item
    create_resp = client.post(
        "/api/v1/worklist",
        json={"title": "Update Me", "status": "new"},
        headers=headers,
    )
    item_id = create_resp.json()["id"]

    # Update item
    update_resp = client.put(
        f"/api/v1/worklist/{item_id}",
        json={"title": "Updated Title", "status": "in_progress"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated Title"
    assert update_resp.json()["status"] == "in_progress"


def test_delete_worklist_item(client):
    # AC: DELETE /api/v1/worklist/{item_id}: Removes a worklist item.
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create item
    create_resp = client.post(
        "/api/v1/worklist", json={"title": "Delete Me"}, headers=headers
    )
    item_id = create_resp.json()["id"]

    # Delete item
    delete_resp = client.delete(f"/api/v1/worklist/{item_id}", headers=headers)
    assert delete_resp.status_code == 200
    assert delete_resp.json()["message"] == "Item deleted successfully"

    # Verify deleted
    get_resp = client.get("/api/v1/worklist", headers=headers)
    assert all(item["id"] != item_id for item in get_resp.json()["items"])


def test_rbac_restrictions(client):
    # AC: Security: Implement role-based access control (RBAC)
    user_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create item as regular user
    create_resp = client.post(
        "/api/v1/worklist", json={"title": "User Task"}, headers=user_headers
    )
    item_id = create_resp.json()["id"]

    # Register another user
    client.post(
        "/api/v1/auth/register",
        json={"email": "other@example.com", "password": "password123", "role": "user"},
    )
    other_headers = get_auth_headers(client, "other@example.com", "password123")

    # Other user tries to update user's task -> 403
    update_resp = client.put(
        f"/api/v1/worklist/{item_id}",
        json={"title": "Hacked Title"},
        headers=other_headers,
    )
    assert update_resp.status_code == 403

    # Other user tries to delete user's task -> 403
    delete_resp = client.delete(f"/api/v1/worklist/{item_id}", headers=other_headers)
    assert delete_resp.status_code == 403

    # Admin tries to update user's task -> 200
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    admin_update_resp = client.put(
        f"/api/v1/worklist/{item_id}",
        json={"title": "Admin Updated Title"},
        headers=admin_headers,
    )
    assert admin_update_resp.status_code == 200
    assert admin_update_resp.json()["title"] == "Admin Updated Title"


def test_websocket_connection(client):
    # AC: Real-time Updates: Implement a WebSocket connection
    with client.websocket_connect("/ws/v1/worklist") as websocket:
        # Create an item to trigger broadcast
        headers = get_auth_headers(client, "test@example.com", "testpassword")
        client.post("/api/v1/worklist", json={"title": "WS Task"}, headers=headers)

        # Receive broadcast message
        message = websocket.receive_json()
        assert message["event"] == "item_created"
        assert message["data"]["title"] == "WS Task"
