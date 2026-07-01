from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_create_user(client: TestClient):
    # Test successful user creation
    response = client.post("/api/v1/users", json={"username": "kid_explorer"})
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "kid_explorer"
    assert "id" in data
    assert "created_at" in data

    # Test duplicate username returns 400
    response = client.post("/api/v1/users", json={"username": "kid_explorer"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already exists"

    # Test invalid username (empty) returns 400
    response = client.post("/api/v1/users", json={"username": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Username is invalid"


def test_get_activities(client: TestClient):
    # Test valid modules
    for module in ["nutrition", "exercise", "hygiene"]:
        response = client.get(f"/api/v1/activities/{module}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["module"] == module
        assert "name" in data[0]
        assert "points" in data[0]

    # Test invalid module name returns 400
    response = client.get("/api/v1/activities/invalid_module")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid module name"


def test_save_progress_and_badges(client: TestClient, db: Session):
    # Create a user
    user_response = client.post("/api/v1/users", json={"username": "test_kid"})
    user_id = user_response.json()["id"]

    # Get nutrition activities
    act_response = client.get("/api/v1/activities/nutrition")
    activities = act_response.json()
    assert len(activities) > 0
    activity_id = activities[0]["id"]

    # Save progress
    progress_response = client.post(
        "/api/v1/progress",
        json={
            "user_id": user_id,
            "activity_id": activity_id,
            "completed": True,
            "score": 100,
        },
    )
    assert progress_response.status_code == 200
    progress_data = progress_response.json()
    assert progress_data["user_id"] == user_id
    assert progress_data["activity_id"] == activity_id
    assert progress_data["points_earned"] == 100
    # Since there is only 1 activity in nutrition, completing it should award the badge
    assert progress_data["badge_awarded"] == "Veggie Champion"

    # Test already completed activity returns 400
    progress_response2 = client.post(
        "/api/v1/progress",
        json={
            "user_id": user_id,
            "activity_id": activity_id,
            "completed": True,
            "score": 100,
        },
    )
    assert progress_response2.status_code == 400
    response_detail = progress_response2.json()["detail"]
    assert "already completed" in response_detail

    # Test non-existent user returns 404
    progress_response_no_user = client.post(
        "/api/v1/progress",
        json={
            "user_id": "non-existent-uuid",
            "activity_id": activity_id,
            "completed": True,
        },
    )
    assert progress_response_no_user.status_code == 404

    # Test non-existent activity returns 404
    progress_response_no_act = client.post(
        "/api/v1/progress",
        json={
            "user_id": user_id,
            "activity_id": "non-existent-uuid",
            "completed": True,
        },
    )
    assert progress_response_no_act.status_code == 404


def test_get_progress_summary(client: TestClient):
    # Create a user
    user_response = client.post("/api/v1/users", json={"username": "summary_kid"})
    user_id = user_response.json()["id"]

    # Get summary (should be empty initially)
    summary_response = client.get(f"/api/v1/progress/{user_id}")
    assert summary_response.status_code == 200
    summary_data = summary_response.json()
    assert summary_data["user_id"] == user_id
    assert summary_data["username"] == "summary_kid"
    assert summary_data["total_points"] == 0
    assert len(summary_data["completed_activities"]) == 0
    assert len(summary_data["unlocked_badges"]) == 0

    # Complete an activity
    act_response = client.get("/api/v1/activities/exercise")
    activity_id = act_response.json()[0]["id"]

    client.post(
        "/api/v1/progress",
        json={"user_id": user_id, "activity_id": activity_id, "completed": True},
    )

    # Get summary again
    summary_response = client.get(f"/api/v1/progress/{user_id}")
    assert summary_response.status_code == 200
    summary_data = summary_response.json()
    assert summary_data["total_points"] == 100
    assert len(summary_data["completed_activities"]) == 1
    assert summary_data["completed_activities"][0]["activity_id"] == activity_id
    assert len(summary_data["unlocked_badges"]) == 1
    assert summary_data["unlocked_badges"][0]["badge_name"] == "Active Kangaroo"

    # Test non-existent user returns 404
    summary_response_no_user = client.get("/api/v1/progress/non-existent-uuid")
    assert summary_response_no_user.status_code == 404
