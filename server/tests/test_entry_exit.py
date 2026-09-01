import uuid
from datetime import date, timedelta


def test_check_in_and_check_out_flow(client):
    # 1. Get verified visitor and active inmate
    visitor_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    visitor_id = visitor_res.json()["id"]

    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    inmate_id = inmates_res.json()[0]["id"]

    # 2. Create appointment for today
    today = (date.today() + timedelta(days=30)).isoformat()
    appt_res = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": today,
            "start_time": "13:00",
            "relationship": "Lawyer",
        },
    )
    assert appt_res.status_code == 201
    appointment_id = appt_res.json()["id"]

    # 3. Approve appointment
    client.patch(
        f"/api/v1/appointments/{appointment_id}/status",
        json={"status": "APPROVED"},
    )

    # 4. Check-in
    officer_id = str(uuid.uuid4())
    checkin_res = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appointment_id, "officer_id": officer_id},
    )
    assert checkin_res.status_code == 201
    log_data = checkin_res.json()
    assert log_data["check_in_time"] is not None
    assert log_data["check_out_time"] is None

    # 5. Check-out
    checkout_res = client.post(
        "/api/v1/entry-exit-logs/check-out",
        json={"appointment_id": appointment_id, "officer_id": officer_id},
    )
    assert checkout_res.status_code == 200
    assert checkout_res.json()["check_out_time"] is not None

    # Verify appointment is now COMPLETED
    appt_after = client.get(f"/api/v1/appointments/{appointment_id}").json()
    assert appt_after["status"] == "COMPLETED"


def test_check_in_unapproved_appointment_fails(client):
    visitor_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    visitor_id = visitor_res.json()["id"]

    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    inmate_id = inmates_res.json()[0]["id"]

    target_date = (date.today() + timedelta(days=35)).isoformat()
    appt_res = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": target_date,
            "start_time": "16:00",
            "relationship": "Friend",
        },
    )
    assert appt_res.status_code == 201
    appointment_id = appt_res.json()["id"]

    # Attempt check-in without approval
    checkin_res = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appointment_id},
    )
    assert checkin_res.status_code == 400
    assert "unapproved" in checkin_res.json()["detail"].lower()


def test_duplicate_check_in_fails(client):
    visitor_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    visitor_id = visitor_res.json()["id"]

    inmates_res = client.get("/api/v1/inmates?status=ACTIVE")
    inmate_id = inmates_res.json()[0]["id"]

    target_date = (date.today() + timedelta(days=40)).isoformat()
    appt_res = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": target_date,
            "start_time": "10:00",
            "relationship": "Family",
        },
    )
    assert appt_res.status_code == 201
    appointment_id = appt_res.json()["id"]

    # Approve
    client.patch(
        f"/api/v1/appointments/{appointment_id}/status",
        json={"status": "APPROVED"},
    )

    # Check in 1
    res1 = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appointment_id},
    )
    assert res1.status_code == 201

    # Check in 2 (duplicate)
    res2 = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appointment_id},
    )
    assert res2.status_code == 400
    assert "already checked in" in res2.json()["detail"].lower()
