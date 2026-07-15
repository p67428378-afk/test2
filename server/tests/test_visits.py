from server.models import User, Inmate


def get_auth_headers(
    client,
    email: str,
    password: str,
    role: str = "visitor",
    full_name: str = "Test User",
    gov_id: str = "GOV-123",
):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": full_name,
            "phone": "+123456",
            "gov_id": gov_id,
        },
    )
    if role != "visitor":
        from server.tests.conftest import TestingSessionLocal

        db = TestingSessionLocal()
        user = db.query(User).filter(User.email == email).first()
        user.role = role
        db.commit()
        db.close()

    login_resp = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_check_in_check_out_and_flag(client):
    # Create inmate
    from server.tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    inmate = Inmate(
        full_name="Inmate One", inmate_number="IN-001", cell_location="Block A"
    )
    db.add(inmate)
    db.commit()
    inmate_id = str(inmate.id)
    db.close()

    # Visitor registers and requests appointment
    visitor_headers = get_auth_headers(
        client, "visitor@example.com", "password", gov_id="GOV-VISITOR"
    )
    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-20",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=visitor_headers,
    )
    appt_id = appt_resp.json()["id"]
    visitor_id = appt_resp.json()["visitor_id"]

    # Staff approves appointment
    staff_headers = get_auth_headers(
        client, "staff@example.com", "password", role="staff", gov_id="GOV-STAFF"
    )
    client.put(
        f"/api/v1/appointments/{appt_id}/approve",
        json={"status": "approved"},
        headers=staff_headers,
    )

    # Security checks in visitor
    security_headers = get_auth_headers(
        client,
        "security@example.com",
        "password",
        role="security",
        gov_id="GOV-SECURITY",
    )
    checkin_resp = client.post(
        "/api/v1/visits/check-in",
        json={"appointment_id": appt_id},
        headers=security_headers,
    )
    assert checkin_resp.status_code == 200
    assert checkin_resp.json()["status"] == "checked-in"
    visit_log_id = checkin_resp.json()["id"]

    # Security checks out visitor
    checkout_resp = client.post(
        "/api/v1/visits/check-out",
        json={"visit_log_id": visit_log_id},
        headers=security_headers,
    )
    assert checkout_resp.status_code == 200
    assert checkout_resp.json()["status"] == "completed"

    # Get visit history
    history_resp = client.get(
        f"/api/v1/visits/history/{inmate_id}", headers=security_headers
    )
    assert history_resp.status_code == 200
    assert len(history_resp.json()) == 1
    assert history_resp.json()[0]["status"] == "completed"

    # Security flags visitor
    flag_resp = client.post(
        "/api/v1/security/flag",
        json={"visitor_id": visitor_id, "reason": "Brought contraband"},
        headers=security_headers,
    )
    assert flag_resp.status_code == 200
    assert flag_resp.json()["is_active"] is True

    # Visitor tries to request another appointment -> should fail because flagged
    response = client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-21",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=visitor_headers,
    )
    assert response.status_code == 400
    assert "visitor is flagged" in response.json()["detail"]
