def test_log_and_list_practice_session(client):
    routines_res = client.get("/api/v1/routines")
    routines = routines_res.json()
    assert len(routines) > 0
    routine_id = routines[0]["id"]

    payload = {
        "routine_id": routine_id,
        "completed_duration_seconds": 600,
        "poses_completed": 4,
        "notes": "Felt great, breathing was smooth.",
        "user_id": "session_tester",
    }

    res = client.post("/api/v1/practice-sessions", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["routine_id"] == routine_id
    assert data["completed_duration_seconds"] == 600
    assert data["poses_completed"] == 4
    assert data["notes"] == "Felt great, breathing was smooth."
    assert data["routine_name"] is not None

    # List practice sessions
    list_res = client.get("/api/v1/practice-sessions?user_id=session_tester")
    assert list_res.status_code == 200
    sessions = list_res.json()
    assert len(sessions) >= 1
    assert sessions[0]["user_id"] == "session_tester"
    assert sessions[0]["completed_duration_seconds"] == 600


def test_log_freestyle_practice_session(client):
    payload = {
        "routine_id": None,
        "completed_duration_seconds": 300,
        "poses_completed": 3,
        "notes": "Freestyle stretching.",
        "user_id": "freestyle_tester",
    }

    res = client.post("/api/v1/practice-sessions", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["routine_id"] is None
    assert data["poses_completed"] == 3
