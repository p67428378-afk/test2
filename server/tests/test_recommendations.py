from datetime import datetime, timezone, timedelta


def test_recommendations_empty(client):
    # AC: AI-Driven Topic Recommendations: returns empty list when no topics exist
    res = client.get("/api/v1/recommendations/next-topics")
    assert res.status_code == 200
    assert res.json() == {"recommendations": []}


def test_recommendations_prioritize_hard_and_upcoming_exam(client):
    # AC: AI recommendation prioritization incorporates difficulty, target exam dates, and completion status
    # Subject 1: Exam in 2 days
    exam_near = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    s1 = client.post(
        "/api/v1/subjects",
        json={"title": "Data Structures", "target_exam_date": exam_near},
    ).json()

    # Subject 2: Exam in 30 days
    exam_far = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    s2 = client.post(
        "/api/v1/subjects",
        json={"title": "Art History", "target_exam_date": exam_far},
    ).json()

    # Topic A: Hard, Urgent Subject, Not Started
    t_hard = client.post(
        "/api/v1/topics",
        json={
            "subject_id": s1["id"],
            "title": "Red-Black Trees",
            "estimated_minutes": 90,
            "difficulty": "Hard",
        },
    ).json()

    # Topic B: Easy, Far Subject, Not Started
    t_easy = client.post(
        "/api/v1/topics",
        json={
            "subject_id": s2["id"],
            "title": "Cave Paintings",
            "estimated_minutes": 30,
            "difficulty": "Easy",
        },
    ).json()

    rec_res = client.get("/api/v1/recommendations/next-topics?limit=5")
    assert rec_res.status_code == 200
    recs = rec_res.json()["recommendations"]
    assert len(recs) == 2

    # Top recommendation must be the Hard topic with upcoming exam
    top_rec = recs[0]
    assert top_rec["topic_id"] == t_hard["id"]
    assert top_rec["difficulty"] == "Hard"
    assert top_rec["subject_title"] == "Data Structures"
    assert top_rec["priority_score"] > recs[1]["priority_score"]
    assert (
        "upcoming exam" in top_rec["recommendation_reason"]
        or "due" in top_rec["recommendation_reason"]
    )


def test_recommendations_decay_curve_and_completion(client):
    # AC: AI engine analyzes study history and completion status
    s = client.post(
        "/api/v1/subjects",
        json={"title": "Machine Learning"},
    ).json()

    # Topic 1: Completed
    t1 = client.post(
        "/api/v1/topics",
        json={
            "subject_id": s["id"],
            "title": "Linear Regression",
            "difficulty": "Hard",
            "status": "Completed",
        },
    ).json()

    # Topic 2: Not Started, Medium
    t2 = client.post(
        "/api/v1/topics",
        json={
            "subject_id": s["id"],
            "title": "Neural Networks",
            "difficulty": "Medium",
            "status": "Not Started",
        },
    ).json()

    rec_res = client.get("/api/v1/recommendations/next-topics?limit=2")
    assert rec_res.status_code == 200
    recs = rec_res.json()["recommendations"]
    assert len(recs) == 2

    # Uncompleted topic (Neural Networks) should rank higher than completed topic (Linear Regression)
    assert recs[0]["topic_id"] == t2["id"]
    assert recs[1]["topic_id"] == t1["id"]
