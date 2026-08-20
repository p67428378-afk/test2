def get_auth_headers(client, username, password):
    response = client.post(
        "/api/v1/auth/login", json={"username": username, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_children_progress_success(client):
    headers = get_auth_headers(client, "sarah_parent", "adminpassword")
    response = client.get("/api/v1/parent/progress", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["username"] == "timmy"
    assert data[0]["total_stars"] == 120
    assert data[0]["current_streak"] == 5


def test_get_children_progress_forbidden_for_child(client):
    headers = get_auth_headers(client, "timmy", "testpassword")
    response = client.get("/api/v1/parent/progress", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Only parents/teachers can access this resource"


def test_toggle_habit_success(client):
    headers = get_auth_headers(client, "sarah_parent", "adminpassword")

    # Get habits first to find an ID
    child_headers = get_auth_headers(client, "timmy", "testpassword")
    response = client.get("/api/v1/habits", headers=child_headers)
    habit_id = response.json()[0]["id"]

    # Toggle off
    response = client.post(
        f"/api/v1/parent/habits/{habit_id}/toggle",
        headers=headers,
        json={"is_active": False},
    )
    assert response.status_code == 200
    assert response.json()["is_active"] is False

    # Verify it is no longer returned in active habits
    response = client.get("/api/v1/habits", headers=child_headers)
    assert len(response.json()) == 3


def test_reset_child_progress_success(client):
    headers = get_auth_headers(client, "sarah_parent", "adminpassword")

    # Get child ID from progress
    response = client.get("/api/v1/parent/progress", headers=headers)
    child_id = response.json()[0]["child_id"]

    # Reset progress
    response = client.post(f"/api/v1/parent/progress/{child_id}/reset", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_stars"] == 0
    assert data["current_streak"] == 0

    # Verify in progress summary
    response = client.get("/api/v1/parent/progress", headers=headers)
    assert response.json()[0]["total_stars"] == 0
    assert response.json()[0]["current_streak"] == 0
