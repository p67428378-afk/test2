def test_submit_and_list_sessions(client, auth_headers_admin, auth_headers_speaker):
    # Create conference
    conf_res = client.post(
        "/api/v1/conferences",
        json={
            "title": "AI Summit 2026",
            "location": "Boston, MA",
            "start_date": "2026-11-01T09:00:00Z",
            "end_date": "2026-11-02T18:00:00Z",
        },
        headers=auth_headers_admin,
    )
    conf_id = conf_res.json()["id"]

    # Submit session as speaker
    session_payload = {
        "conference_id": conf_id,
        "title": "Building Scalable AI Pipelines with FastAPI",
        "abstract": "In this talk, we explore end-to-end design patterns for high-throughput AI services.",
        "track": "AI/ML",
    }
    res_sub = client.post(
        "/api/v1/sessions", json=session_payload, headers=auth_headers_speaker
    )
    assert res_sub.status_code == 201
    sess_data = res_sub.json()
    assert sess_data["title"] == session_payload["title"]
    assert sess_data["status"] == "SUBMITTED"
    session_id = sess_data["id"]

    # List sessions by conference_id
    res_list = client.get(f"/api/v1/sessions?conference_id={conf_id}")
    assert res_list.status_code == 200
    sessions = res_list.json()
    assert len(sessions) == 1
    assert sessions[0]["id"] == session_id
