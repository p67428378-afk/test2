from server.models import User, Inmate


def get_auth_headers(
    client,
    email: str,
    password: str,
    role: str = "visitor",
    full_name: str = "Test User",
    gov_id: str = "GOV-123",
):
    # Register
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
    # If role is staff or security, update role in DB
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


def test_create_appointment(client):
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

    headers = get_auth_headers(client, "visitor@example.com", "password")

    response = client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-20",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["time_slot"] == "10:30 AM - 11:30 AM"


def test_appointment_limit_per_inmate(client):
    from server.tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    inmate = Inmate(
        full_name="Inmate One", inmate_number="IN-001", cell_location="Block A"
    )
    db.add(inmate)
    db.commit()
    inmate_id = str(inmate.id)
    db.close()

    # Create 2 appointments for this inmate on same date
    headers1 = get_auth_headers(client, "v1@example.com", "password", gov_id="GOV-1")
    client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-20",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=headers1,
    )

    headers2 = get_auth_headers(client, "v2@example.com", "password", gov_id="GOV-2")
    client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-20",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=headers2,
    )

    # Third appointment should fail due to limit
    headers3 = get_auth_headers(client, "v3@example.com", "password", gov_id="GOV-3")
    response = client.post(
        "/api/v1/appointments",
        json={
            "inmate_id": inmate_id,
            "requested_date": "2026-07-20",
            "time_slot": "10:30 AM - 11:30 AM",
        },
        headers=headers3,
    )
    assert response.status_code == 400
    assert "maximum visitor limit" in response.json()["detail"]


def test_staff_approve_deny_appointment(client):
    from server.tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    inmate = Inmate(
        full_name="Inmate One", inmate_number="IN-001", cell_location="Block A"
    )
    db.add(inmate)
    db.commit()
    inmate_id = str(inmate.id)
    db.close()

    visitor_headers = get_auth_headers(client, "visitor@example.com", "password")
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

    staff_headers = get_auth_headers(
        client, "staff@example.com", "password", role="staff", gov_id="GOV-STAFF"
    )

    # Get pending
    pending_resp = client.get("/api/v1/appointments/pending", headers=staff_headers)
    assert pending_resp.status_code == 200
    assert len(pending_resp.json()) == 1

    # Approve
    approve_resp = client.put(
        f"/api/v1/appointments/{appt_id}/approve",
        json={"status": "approved"},
        headers=staff_headers,
    )
    assert approve_resp.status_code == 200
    assert approve_resp.json()["status"] == "approved"
