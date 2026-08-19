def test_publish_and_get_schedule(client, auth_headers_admin, auth_headers_speaker):
    # Setup conference & session
    conf_res = client.post(
        "/api/v1/conferences",
        json={
            "title": "Security Forum 2026",
            "location": "Austin, TX",
            "start_date": "2026-10-10T09:00:00Z",
            "end_date": "2026-10-11T18:00:00Z",
        },
        headers=auth_headers_admin,
    )
    conf_id = conf_res.json()["id"]

    sess_res = client.post(
        "/api/v1/sessions",
        json={
            "conference_id": conf_id,
            "title": "Zero Trust Security in Enterprise",
            "abstract": "Key principles of zero trust architecture.",
            "track": "Cybersecurity",
        },
        headers=auth_headers_speaker,
    )
    session_id = sess_res.json()["id"]

    # Publish schedule slot
    schedule_payload = {
        "conference_id": conf_id,
        "slots": [
            {
                "session_id": session_id,
                "hall_name": "Main Auditorium",
                "start_time": "2026-10-10T10:00:00Z",
                "end_time": "2026-10-10T11:00:00Z",
            }
        ],
    }
    res_pub = client.post(
        "/api/v1/schedules/publish", json=schedule_payload, headers=auth_headers_admin
    )
    assert res_pub.status_code == 201
    schedules = res_pub.json()
    assert len(schedules) == 1
    assert schedules[0]["hall_name"] == "Main Auditorium"

    # Get public schedule for conference
    res_sched = client.get(f"/api/v1/schedules/conference/{conf_id}")
    assert res_sched.status_code == 200
    assert len(res_sched.json()) == 1
    assert res_sched.json()[0]["session_id"] == session_id
