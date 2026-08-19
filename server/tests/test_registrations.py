def test_attendee_registration(client, auth_headers_admin, auth_headers_attendee):
    # Create conference
    conf_res = client.post(
        "/api/v1/conferences",
        json={
            "title": "DevOps World 2026",
            "location": "Chicago, IL",
            "start_date": "2026-08-15T09:00:00Z",
            "end_date": "2026-08-17T18:00:00Z",
        },
        headers=auth_headers_admin,
    )
    conf_id = conf_res.json()["id"]

    # Register attendee
    reg_payload = {
        "conference_id": conf_id,
        "ticket_type": "VIP",
    }
    res_reg = client.post(
        "/api/v1/registrations", json=reg_payload, headers=auth_headers_attendee
    )
    assert res_reg.status_code == 201
    reg_data = res_reg.json()
    assert reg_data["ticket_type"] == "VIP"
    assert reg_data["status"] == "CONFIRMED"

    # Get attendee user details to get user_id
    me_res = client.get("/api/v1/auth/me", headers=auth_headers_attendee)
    user_id = me_res.json()["id"]

    # Get registrations for user
    res_user_regs = client.get(f"/api/v1/registrations/user/{user_id}")
    assert res_user_regs.status_code == 200
    assert len(res_user_regs.json()) >= 1
    assert any(r["conference_id"] == conf_id for r in res_user_regs.json())
