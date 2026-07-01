from fastapi.testclient import TestClient


def test_create_or_get_user(client: TestClient):
    # Create a new user
    response = client.post("/api/v1/users", json={"username": "kid123"})
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "kid123"
    assert "id" in data
    assert "created_at" in data

    # Get the same user (idempotent)
    response2 = client.post("/api/v1/users", json={"username": "kid123"})
    assert response2.status_code == 201 or response2.status_code == 200
    data2 = response2.json()
    assert data2["id"] == data["id"]

    # Invalid username (empty)
    response_err = client.post("/api/v1/users", json={"username": "   "})
    assert response_err.status_code == 400


def test_get_activities(client: TestClient):
    # Fetch nutrition activities
    response = client.get("/api/v1/activities/nutrition")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["module"] == "nutrition"
    assert data[0]["name"] == "Sort the Foods!"

    # Fetch exercise activities
    response = client.get("/api/v1/activities/exercise")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["module"] == "exercise"

    # Fetch hygiene activities
    response = client.get("/api/v1/activities/hygiene")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["module"] == "hygiene"

    # Invalid module
    response_err = client.get("/api/v1/activities/invalid_module")
    assert response_err.status_code == 400


def test_save_progress_and_badges(client: TestClient):
    # Create user
    user_resp = client.post("/api/v1/users", json={"username": "explorer"})
    user_id = user_resp.json()["id"]

    # Get nutrition activity
    act_resp = client.get("/api/v1/activities/nutrition")
    act_id = act_resp.json()[0]["id"]

    # Save progress
    progress_payload = {
        "user_id": user_id,
        "activity_id": act_id,
        "completed": True,
        "score": 100.0,
    }
    response = client.post("/api/v1/progress", json=progress_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["activity_id"] == act_id
    assert data["points_earned"] == 100
    # Since there is only 1 activity in nutrition, completing it should award the badge
    assert data["badge_awarded"] == "Veggie Champion"

    # Try to complete again (should fail with 400)
    response_dup = client.post("/api/v1/progress", json=progress_payload)
    assert response_dup.status_code == 400

    # Non-existent user
    progress_payload_bad_user = progress_payload.copy()
    progress_payload_bad_user["user_id"] = "non-existent-uuid"
    response_err1 = client.post("/api/v1/progress", json=progress_payload_bad_user)
    assert response_err1.status_code == 404

    # Non-existent activity
    progress_payload_bad_act = progress_payload.copy()
    progress_payload_bad_act["activity_id"] = "non-existent-uuid"
    response_err2 = client.post("/api/v1/progress", json=progress_payload_bad_act)
    assert response_err2.status_code == 404


def test_get_user_progress_summary(client: TestClient):
    # Create user
    user_resp = client.post("/api/v1/users", json={"username": "superkid"})
    user_id = user_resp.json()["id"]

    # Get summary (should be empty initially)
    response = client.get(f"/api/v1/progress/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["total_points"] == 0
    assert len(data["completed_activities"]) == 0
    assert len(data["unlocked_badges"]) == 0

    # Complete nutrition activity
    act_resp = client.get("/api/v1/activities/nutrition")
    act_id = act_resp.json()[0]["id"]
    client.post(
        "/api/v1/progress",
        json={
            "user_id": user_id,
            "activity_id": act_id,
            "completed": True,
            "score": 100.0,
        },
    )

    # Get summary again
    response2 = client.get(f"/api/v1/progress/{user_id}")
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["total_points"] == 100
    assert len(data2["completed_activities"]) == 1
    assert data2["completed_activities"][0]["activity_id"] == act_id
    assert len(data2["unlocked_badges"]) == 1
    assert data2["unlocked_badges"][0]["badge_name"] == "Veggie Champion"

    # Non-existent user summary
    response_err = client.get("/api/v1/progress/non-existent-uuid")
    assert response_err.status_code == 404
