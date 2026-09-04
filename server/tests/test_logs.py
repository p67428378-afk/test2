def test_create_study_log(client):
    # AC: Progress Tracking & Analytics: System logs study sessions
    sub_res = client.post("/api/v1/subjects", json={"title": "Software Engineering"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Design Patterns",
            "estimated_minutes": 60,
        },
    )
    topic_id = topic_res.json()["id"]

    log_res = client.post(
        "/api/v1/study-logs",
        json={
            "topic_id": topic_id,
            "session_minutes": 45,
            "notes": "Reviewed Singleton and Factory patterns",
        },
    )
    assert log_res.status_code == 201
    data = log_res.json()
    assert data["topic_id"] == topic_id
    assert data["session_minutes"] == 45
    assert data["notes"] == "Reviewed Singleton and Factory patterns"
    assert "logged_at" in data
    assert "id" in data


def test_create_study_log_invalid_topic(client):
    # AC: Logging session for non-existent topic returns 404
    res = client.post(
        "/api/v1/study-logs",
        json={"topic_id": "non-existent-topic", "session_minutes": 30},
    )
    assert res.status_code == 404


def test_list_and_delete_study_logs(client):
    # AC: Users can fetch historical study logs and delete entries
    sub_res = client.post("/api/v1/subjects", json={"title": "Compilers"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Lexical Analysis",
            "estimated_minutes": 60,
        },
    )
    topic_id = topic_res.json()["id"]

    log1 = client.post(
        "/api/v1/study-logs",
        json={"topic_id": topic_id, "session_minutes": 30, "notes": "Session 1"},
    )
    log1_id = log1.json()["id"]

    client.post(
        "/api/v1/study-logs",
        json={"topic_id": topic_id, "session_minutes": 50, "notes": "Session 2"},
    )

    # List logs by topic
    list_res = client.get(f"/api/v1/study-logs?topic_id={topic_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 2

    # Delete first log
    del_res = client.delete(f"/api/v1/study-logs/{log1_id}")
    assert del_res.status_code == 204
    assert client.get(f"/api/v1/study-logs/{log1_id}").status_code == 404
