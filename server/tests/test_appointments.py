from datetime import date, timedelta


def test_create_and_approve_appointment(client):
    # 1. Get eligible inmate and verified visitor
    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    assert inmates_res.status_code == 200
    inmates = inmates_res.json()
    assert len(inmates) > 0
    inmate_id = inmates[0]["id"]

    visitor_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    assert visitor_res.status_code == 200
    visitor_id = visitor_res.json()["id"]

    # 2. Schedule appointment
    target_date = (date.today() + timedelta(days=2)).isoformat()
    payload = {
        "visitor_id": visitor_id,
        "inmate_id": inmate_id,
        "visit_date": target_date,
        "start_time": "14:00",
        "relationship": "Spouse",
    }
    create_res = client.post("/api/v1/appointments", json=payload)
    assert create_res.status_code == 201
    appointment = create_res.json()
    assert appointment["status"] == "PENDING"
    appointment_id = appointment["id"]

    # 3. Approve appointment
    patch_res = client.patch(
        f"/api/v1/appointments/{appointment_id}/status",
        json={"status": "APPROVED"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "APPROVED"


def test_appointment_approval_blocked_for_unverified_visitor(client):
    # 1. Get pending visitor
    visitor_res = client.get("/api/v1/visitors/profile?email=pending@example.com")
    assert visitor_res.status_code == 200
    visitor_id = visitor_res.json()["id"]

    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    inmate_id = inmates_res.json()[0]["id"]

    # 2. Create appointment
    target_date = (date.today() + timedelta(days=3)).isoformat()
    create_res = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": target_date,
            "start_time": "10:30",
            "relationship": "Sibling",
        },
    )
    assert create_res.status_code == 201
    appointment_id = create_res.json()["id"]

    # 3. Try to approve - must fail with 403 because verification_status is PENDING
    approve_res = client.patch(
        f"/api/v1/appointments/{appointment_id}/status",
        json={"status": "APPROVED"},
    )
    assert approve_res.status_code in [400, 403]
    assert "unverified" in approve_res.json()["detail"].lower()


def test_weekly_quota_enforcement(client):
    # Inmate has max 2 visits per calendar week
    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    inmate_id = inmates_res.json()[1]["id"]  # use second inmate

    visitor_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    visitor_id = visitor_res.json()["id"]

    base_date = date.today() + timedelta(days=10)

    # 1st appointment
    appt1 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": base_date.isoformat(),
            "start_time": "09:00",
            "relationship": "Friend",
        },
    ).json()
    client.patch(
        f"/api/v1/appointments/{appt1['id']}/status", json={"status": "APPROVED"}
    )

    # 2nd appointment in same week
    appt2 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": (base_date + timedelta(days=1)).isoformat(),
            "start_time": "11:00",
            "relationship": "Friend",
        },
    ).json()
    client.patch(
        f"/api/v1/appointments/{appt2['id']}/status", json={"status": "APPROVED"}
    )

    # 3rd appointment in same week should be rejected by quota check
    appt3_res = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": (base_date + timedelta(days=2)).isoformat(),
            "start_time": "15:00",
            "relationship": "Friend",
        },
    )
    assert appt3_res.status_code == 400
    assert "maximum 2 visits per week" in appt3_res.json()["detail"].lower()
