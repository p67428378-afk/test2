def test_review_and_score_session(
    client, auth_headers_admin, auth_headers_speaker, auth_headers_reviewer
):
    # Setup conference & session
    conf_res = client.post(
        "/api/v1/conferences",
        json={
            "title": "Cloud Conf 2026",
            "location": "Seattle, WA",
            "start_date": "2026-12-01T09:00:00Z",
            "end_date": "2026-12-02T18:00:00Z",
        },
        headers=auth_headers_admin,
    )
    conf_id = conf_res.json()["id"]

    sess_res = client.post(
        "/api/v1/sessions",
        json={
            "conference_id": conf_id,
            "title": "Microservices with Kubernetes",
            "abstract": "Deep dive into service mesh and autoscaling.",
            "track": "Cloud Architecture",
        },
        headers=auth_headers_speaker,
    )
    session_id = sess_res.json()["id"]

    # Submit review as reviewer
    review_payload = {
        "session_id": session_id,
        "score": 9,
        "comments": "Excellent proposal with strong technical depth.",
        "decision": "APPROVED",
    }
    res_review = client.post(
        "/api/v1/reviews", json=review_payload, headers=auth_headers_reviewer
    )
    assert res_review.status_code == 201
    review_data = res_review.json()
    assert review_data["score"] == 9
    assert review_data["decision"] == "APPROVED"

    # Verify session status updated to APPROVED
    sess_get = client.get(f"/api/v1/sessions/{session_id}")
    assert sess_get.json()["status"] == "APPROVED"

    # View reviews for session
    res_session_reviews = client.get(f"/api/v1/reviews/session/{session_id}")
    assert res_session_reviews.status_code == 200
    assert len(res_session_reviews.json()) == 1
