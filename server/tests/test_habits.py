from datetime import date, timedelta
from fastapi import status


def test_list_habits(client):
    response = client.get("/api/v1/habits/")
    assert response.status_code == status.HTTP_200_OK
    habits = response.json()
    assert len(habits) >= 4
    categories = {h["category"] for h in habits}
    assert "Nutrition" in categories or "Personal Hygiene" in categories


def test_log_habit_success(client):
    # Fetch habits first
    habits_resp = client.get("/api/v1/habits/")
    habit_id = habits_resp.json()[0]["id"]

    today = date.today().isoformat()
    response = client.post(
        "/api/v1/habits/logs",
        json={
            "habit_id": habit_id,
            "local_date": today,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["habit_id"] == habit_id
    assert data["points_awarded"] > 0
    assert data["current_streak"] >= 1


def test_duplicate_habit_log_rejection(client):
    habits_resp = client.get("/api/v1/habits/")
    habit_id = habits_resp.json()[0]["id"]
    today = date.today().isoformat()

    # First log
    first_resp = client.post(
        "/api/v1/habits/logs",
        json={"habit_id": habit_id, "local_date": today},
    )
    assert first_resp.status_code == status.HTTP_201_CREATED

    # Second log on same date -> expect 400 Bad Request
    second_resp = client.post(
        "/api/v1/habits/logs",
        json={"habit_id": habit_id, "local_date": today},
    )
    assert second_resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "already logged" in second_resp.json()["detail"].lower()


def test_streak_calculation_consecutive_days(client):
    habits_resp = client.get("/api/v1/habits/")
    habit_1 = habits_resp.json()[0]["id"]
    habit_2 = habits_resp.json()[1]["id"]

    yesterday = (date.today() - timedelta(days=1)).isoformat()
    today = date.today().isoformat()

    # Log yesterday
    resp1 = client.post(
        "/api/v1/habits/logs",
        json={"habit_id": habit_1, "local_date": yesterday},
    )
    assert resp1.status_code == status.HTTP_201_CREATED
    assert resp1.json()["current_streak"] == 1

    # Log today
    resp2 = client.post(
        "/api/v1/habits/logs",
        json={"habit_id": habit_2, "local_date": today},
    )
    assert resp2.status_code == status.HTTP_201_CREATED
    assert resp2.json()["current_streak"] == 2


def test_get_user_streaks(client):
    # Login to get user ID
    login_resp = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "testpassword"},
    )
    user_id = login_resp.json()["user_id"]

    response = client.get(f"/api/v1/users/{user_id}/streaks")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user_id"] == user_id
    assert "current_streak" in data
    assert "longest_streak" in data
    assert "badges" in data
