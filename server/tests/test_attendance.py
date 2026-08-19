def test_check_in_and_get_attendance(
    client, auth_headers_admin, auth_headers_speaker, auth_headers_attendee
):
    # Setup conference & session
    conf_res = client.post(
        "/api/v1/conferences",
        json={
            "title": "Data Science Con 2026",
            "location": "New York, NY",
            "start_date": "2026-11-15T09:00:00Z",
            "end_date": "2026-11-16T18:00:00Z",
        },
        headers=auth_headers_admin,
    )
    conf_id = conf_res.json()["id"]

    sess_res = client.post(
        "/api/v1/sessions",
        json={
            "conference_id": conf_id,
            "title": "LLM Fine-Tuning Strategies",
            "abstract": "Practical fine-tuning techniques.",
            "track": "Data & AI",
        },
        headers=auth_headers_speaker,
    )
    session_id = sess_res.json()["id"]

    # Get attendee user ID
    me_res = client.get("/api/v1/auth/me", headers=auth_headers_attendee)
    attendee_id = me_res.json()["id"]

    # Check in attendee
    checkin_payload = {
        "session_id": session_id,
        "attendee_id": attendee_id,
    }
    res_checkin = client.post(
        "/api/v1/attendance/check-in", json=checkin_payload, headers=auth_headers_admin
    )
    assert res_checkin.status_code == 201
    log_entry = res_checkin.json()
    assert log_entry["session_id"] == session_id
    assert log_entry["attendee_id"] == attendee_id

    # View attendance logs for session
    res_logs = client.get(f"/api/v1/attendance/session/{session_id}")
    assert res_logs.status_code == 200
    assert len(res_logs.json()) == 1
    assert res_logs.json()[0]["attendee_id"] == attendee_id
