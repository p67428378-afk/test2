def test_get_initial_progress(client):
    response = client.get("/api/v1/progress")
    assert response.status_code == 200
    data = response.json()
    assert data["total_stars"] == 0
    assert data["explored_item_ids"] == []


def test_log_progress_success(client):
    # Get learning items first to find a valid ID
    items_response = client.get("/api/v1/learning-items")
    item_id = items_response.json()[0]["id"]

    # Log progress
    response = client.post("/api/v1/progress", json={"learning_item_id": item_id})
    assert response.status_code == 201
    data = response.json()
    assert data["learning_item_id"] == item_id
    assert "id" in data
    assert "user_id" in data

    # Get progress summary again
    summary_response = client.get("/api/v1/progress")
    summary_data = summary_response.json()
    assert summary_data["total_stars"] == 1
    assert item_id in summary_data["explored_item_ids"]


def test_log_progress_invalid_id(client):
    response = client.post(
        "/api/v1/progress", json={"learning_item_id": "invalid-uuid-or-nonexistent"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Learning item not found"


def test_reset_progress_unauthorized(client):
    response = client.post("/api/v1/progress/reset")
    assert response.status_code == 401


def test_reset_progress_success(client):
    # Login to get token
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "parent_admin", "password": "secure_password"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Log some progress first
    items_response = client.get("/api/v1/learning-items")
    item_id = items_response.json()[0]["id"]
    client.post("/api/v1/progress", json={"learning_item_id": item_id})

    # Verify progress is logged
    summary_response = client.get("/api/v1/progress")
    assert summary_response.json()["total_stars"] == 1

    # Reset progress
    reset_response = client.post("/api/v1/progress/reset", headers=headers)
    assert reset_response.status_code == 200
    assert reset_response.json()["status"] == "success"

    # Verify progress is reset
    summary_response = client.get("/api/v1/progress")
    assert summary_response.json()["total_stars"] == 0
