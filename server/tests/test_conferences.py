def test_create_and_list_conferences(client, auth_headers_admin):
    conf_payload = {
        "title": "Global Tech Summit 2026",
        "description": "Annual tech summit on AI, Cloud, and Software Engineering",
        "location": "Convention Center, San Francisco",
        "start_date": "2026-09-10T09:00:00Z",
        "end_date": "2026-09-12T18:00:00Z",
        "status": "DRAFT",
    }

    res_create = client.post(
        "/api/v1/conferences", json=conf_payload, headers=auth_headers_admin
    )
    assert res_create.status_code == 201
    created_conf = res_create.json()
    assert created_conf["title"] == conf_payload["title"]
    conf_id = created_conf["id"]

    # List conferences
    res_list = client.get("/api/v1/conferences")
    assert res_list.status_code == 200
    conferences = res_list.json()
    assert len(conferences) >= 1
    assert any(c["id"] == conf_id for c in conferences)

    # Get single conference
    res_get = client.get(f"/api/v1/conferences/{conf_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == conf_id


def test_conference_permission_denied_for_attendee(client, auth_headers_attendee):
    conf_payload = {
        "title": "Unauthorized Conf",
        "location": "Somewhere",
        "start_date": "2026-10-01T09:00:00Z",
        "end_date": "2026-10-02T18:00:00Z",
    }
    res = client.post(
        "/api/v1/conferences", json=conf_payload, headers=auth_headers_attendee
    )
    assert res.status_code == 403
