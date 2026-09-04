def test_create_topic(client):
    # AC: Users can create nested topics with duration estimates and difficulty ratings
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Linear Algebra", "description": "Vectors and Matrices"},
    )
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Matrix Inversion",
            "estimated_minutes": 75,
            "difficulty": "Hard",
        },
    )
    assert topic_res.status_code == 201
    data = topic_res.json()
    assert data["title"] == "Matrix Inversion"
    assert data["estimated_minutes"] == 75
    assert data["difficulty"] == "Hard"
    assert data["status"] == "Not Started"
    assert data["subject_id"] == subject_id


def test_create_topic_invalid_subject(client):
    # AC: Creating a topic under a non-existent subject returns 404
    response = client.post(
        "/api/v1/topics",
        json={
            "subject_id": "invalid-subject-uuid",
            "title": "Topic Without Subject",
            "estimated_minutes": 60,
            "difficulty": "Medium",
        },
    )
    assert response.status_code == 404


def test_list_and_filter_topics(client):
    # AC: Users can list and filter topics by subject or status
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Discrete Math"},
    )
    subject_id = sub_res.json()["id"]

    client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Graph Theory",
            "estimated_minutes": 90,
            "difficulty": "Hard",
        },
    )
    client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Combinatorics",
            "estimated_minutes": 45,
            "difficulty": "Medium",
        },
    )

    # Filter by subject
    res = client.get(f"/api/v1/topics?subject_id={subject_id}")
    assert res.status_code == 200
    assert len(res.json()) == 2

    # Filter by status
    res_status = client.get("/api/v1/topics?status=Not Started")
    assert res_status.status_code == 200
    assert len(res_status.json()) >= 2


def test_update_topic(client):
    # AC: Users can update topic details
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Computer Networks"},
    )
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "TCP/IP Protocol",
            "estimated_minutes": 60,
            "difficulty": "Medium",
        },
    )
    topic_id = topic_res.json()["id"]

    update_res = client.put(
        f"/api/v1/topics/{topic_id}",
        json={
            "title": "TCP/IP and OSI Model",
            "estimated_minutes": 90,
            "difficulty": "Hard",
        },
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "TCP/IP and OSI Model"
    assert data["estimated_minutes"] == 90
    assert data["difficulty"] == "Hard"


def test_update_topic_status(client):
    # AC: Users can update topic completion status (In Progress, Completed)
    sub_res = client.post("/api/v1/subjects", json={"title": "Biology"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Cell Division",
            "estimated_minutes": 45,
            "difficulty": "Easy",
        },
    )
    topic_id = topic_res.json()["id"]

    # Patch to In Progress
    res1 = client.patch(
        f"/api/v1/topics/{topic_id}/status", json={"status": "In Progress"}
    )
    assert res1.status_code == 200
    assert res1.json()["status"] == "In Progress"

    # Patch to Completed
    res2 = client.patch(
        f"/api/v1/topics/{topic_id}/status", json={"status": "Completed"}
    )
    assert res2.status_code == 200
    assert res2.json()["status"] == "Completed"


def test_delete_topic(client):
    # AC: Users can delete a topic
    sub_res = client.post("/api/v1/subjects", json={"title": "World History"})
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Renaissance",
            "estimated_minutes": 60,
            "difficulty": "Medium",
        },
    )
    topic_id = topic_res.json()["id"]

    del_res = client.delete(f"/api/v1/topics/{topic_id}")
    assert del_res.status_code == 204

    # Fetch should now be 404
    assert client.get(f"/api/v1/topics/{topic_id}").status_code == 404
