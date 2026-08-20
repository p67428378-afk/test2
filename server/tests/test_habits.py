import uuid


def get_auth_headers(client, username, password):
    response = client.post(
        "/api/v1/auth/login", json={"username": username, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_habits(client):
    headers = get_auth_headers(client, "timmy", "testpassword")
    response = client.get("/api/v1/habits", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    for habit in data:
        assert "id" in habit
        assert "name" in habit
        assert "icon" in habit
        assert "points" in habit
        assert habit["is_completed_today"] is False


def test_complete_habit_success(client):
    headers = get_auth_headers(client, "timmy", "testpassword")

    # Get habits to find an ID
    response = client.get("/api/v1/habits", headers=headers)
    habit_id = response.json()[0]["id"]

    # Complete habit
    response = client.post(f"/api/v1/habits/{habit_id}/complete", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["points_earned"] == 10
    assert data["new_total_stars"] == 130  # 120 seeded + 10
    assert data["current_streak"] == 6  # 5 seeded + 1 (since yesterday was completed)


def test_complete_habit_twice_fails(client):
    headers = get_auth_headers(client, "timmy", "testpassword")

    # Get habits to find an ID
    response = client.get("/api/v1/habits", headers=headers)
    habit_id = response.json()[0]["id"]

    # Complete first time
    response = client.post(f"/api/v1/habits/{habit_id}/complete", headers=headers)
    assert response.status_code == 200

    # Complete second time
    response = client.post(f"/api/v1/habits/{habit_id}/complete", headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Habit already completed for today"


def test_complete_habit_invalid_id(client):
    headers = get_auth_headers(client, "timmy", "testpassword")
    response = client.post("/api/v1/habits/not-a-uuid/complete", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Invalid habit ID format"


def test_complete_habit_not_found(client):
    headers = get_auth_headers(client, "timmy", "testpassword")
    random_uuid = str(uuid.uuid4())
    response = client.post(f"/api/v1/habits/{random_uuid}/complete", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Habit not found"
