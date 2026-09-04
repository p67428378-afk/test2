from datetime import datetime, timezone, timedelta


def test_create_subject(client):
    # AC: Subject & Topic Management: Users can create subjects
    target_date = (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
    response = client.post(
        "/api/v1/subjects",
        json={
            "title": "Data Structures & Algorithms",
            "description": "Core computer science topics",
            "target_exam_date": target_date,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Data Structures & Algorithms"
    assert data["description"] == "Core computer science topics"
    assert data["total_topics"] == 0
    assert data["completed_topics"] == 0
    assert data["progress_percentage"] == 0.0
    assert "id" in data


def test_list_subjects_with_progress(client):
    # AC: Progress Tracking & Analytics: System tracks completed topics and updates progress percentages
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Algorithms 101", "description": "Sorting and Searching"},
    )
    assert sub_res.status_code == 201
    subject_id = sub_res.json()["id"]

    # Create 2 topics under subject
    t1 = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Binary Search",
            "estimated_minutes": 45,
            "difficulty": "Easy",
        },
    )
    assert t1.status_code == 201
    t1_id = t1.json()["id"]

    t2 = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Merge Sort",
            "estimated_minutes": 60,
            "difficulty": "Medium",
        },
    )
    assert t2.status_code == 201

    # Mark t1 as Completed
    client.patch(f"/api/v1/topics/{t1_id}/status", json={"status": "Completed"})

    # Check list subjects
    list_res = client.get("/api/v1/subjects")
    assert list_res.status_code == 200
    subjects = list_res.json()
    assert len(subjects) >= 1
    target = next((s for s in subjects if s["id"] == subject_id), None)
    assert target is not None
    assert target["total_topics"] == 2
    assert target["completed_topics"] == 1
    assert target["progress_percentage"] == 50.0


def test_get_subject_details_with_nested_topics(client):
    # AC: Users can read subjects and nested topics
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Operating Systems", "description": "Processes & Memory"},
    )
    subject_id = sub_res.json()["id"]

    client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Virtual Memory",
            "estimated_minutes": 90,
            "difficulty": "Hard",
        },
    )

    detail_res = client.get(f"/api/v1/subjects/{subject_id}")
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["id"] == subject_id
    assert len(data["topics"]) == 1
    assert data["topics"][0]["title"] == "Virtual Memory"
    assert data["topics"][0]["difficulty"] == "Hard"


def test_get_subject_progress(client):
    # AC: Progress percentage per subject is calculated dynamically
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Databases", "description": "SQL and NoSQL"},
    )
    subject_id = sub_res.json()["id"]

    progress_res = client.get(f"/api/v1/subjects/{subject_id}/progress")
    assert progress_res.status_code == 200
    pdata = progress_res.json()
    assert pdata["subject_id"] == subject_id
    assert pdata["total_topics"] == 0
    assert pdata["completed_topics"] == 0
    assert pdata["progress_percentage"] == 0.0


def test_update_subject(client):
    # AC: Users can update subjects
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Physics", "description": "Introductory Physics"},
    )
    subject_id = sub_res.json()["id"]

    update_res = client.put(
        f"/api/v1/subjects/{subject_id}",
        json={"title": "Advanced Physics", "description": "Quantum Mechanics"},
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "Advanced Physics"
    assert data["description"] == "Quantum Mechanics"


def test_delete_subject_cascades(client):
    # AC: Users can delete subjects and nested topics
    sub_res = client.post(
        "/api/v1/subjects",
        json={"title": "Chemistry", "description": "Organic Chemistry"},
    )
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        "/api/v1/topics",
        json={
            "subject_id": subject_id,
            "title": "Alkanes",
            "estimated_minutes": 30,
            "difficulty": "Easy",
        },
    )
    topic_id = topic_res.json()["id"]

    del_res = client.delete(f"/api/v1/subjects/{subject_id}")
    assert del_res.status_code == 204

    # Subject should be 404
    assert client.get(f"/api/v1/subjects/{subject_id}").status_code == 404
    # Nested topic should also be deleted
    assert client.get(f"/api/v1/topics/{topic_id}").status_code == 404


def test_subject_not_found(client):
    # AC: Error handling for non-existent subject returns 404
    response = client.get("/api/v1/subjects/non-existent-id")
    assert response.status_code == 404
