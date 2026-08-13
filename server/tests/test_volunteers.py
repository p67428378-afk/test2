from datetime import datetime, timedelta
from fastapi.testclient import TestClient


def test_volunteer_shift_lifecycle_and_checkin(client: TestClient):
    # 1. Create Volunteer
    vol_resp = client.post(
        "/api/v1/volunteers",
        json={
            "full_name": "Carol Danvers",
            "email": "carol@festival.org",
            "phone": "+15550300",
            "assigned_zone": "Gates",
        },
    )
    assert vol_resp.status_code == 201
    vol_id = vol_resp.json()["id"]

    # 2. Create Shift
    start_t = datetime.utcnow() + timedelta(hours=2)
    end_t = start_t + timedelta(hours=4)
    shift_resp = client.post(
        "/api/v1/volunteers/shifts",
        json={
            "volunteer_id": vol_id,
            "zone_name": "Gates",
            "start_time": start_t.isoformat(),
            "end_time": end_t.isoformat(),
        },
    )
    assert shift_resp.status_code == 201
    shift = shift_resp.json()
    assert shift["status"] == "ASSIGNED"

    # 3. Check-In
    checkin_resp = client.post(f"/api/v1/volunteers/shifts/{shift['id']}/check-in")
    assert checkin_resp.status_code == 200
    assert checkin_resp.json()["status"] == "CHECKED_IN"
    assert checkin_resp.json()["check_in_time"] is not None


def test_volunteer_shift_drop_triggers_standby_broadcast(client: TestClient):
    # Create shift starting in 30 minutes (within 1 hour)
    start_t = datetime.utcnow() + timedelta(minutes=30)
    end_t = start_t + timedelta(hours=4)
    shift_resp = client.post(
        "/api/v1/volunteers/shifts",
        json={
            "zone_name": "Information Desks",
            "start_time": start_t.isoformat(),
            "end_time": end_t.isoformat(),
        },
    )
    shift_id = shift_resp.json()["id"]

    # Drop shift
    drop_resp = client.post(
        f"/api/v1/volunteers/shifts/{shift_id}/drop",
        json={"reason": "Personal Emergency"},
    )
    assert drop_resp.status_code == 200
    assert drop_resp.json()["status"] == "DROPPED"

    # Verify Standby Alert created
    alerts_resp = client.get("/api/v1/volunteers/alerts")
    assert alerts_resp.status_code == 200
    alerts = alerts_resp.json()
    assert any(
        a["shift_id"] == shift_id and a["alert_type"] == "STANDBY_BROADCAST"
        for a in alerts
    )


def test_absent_volunteer_flagging(client: TestClient):
    # Create shift starting 30 minutes in the past without check-in
    past_start = datetime.utcnow() - timedelta(minutes=30)
    past_end = past_start + timedelta(hours=4)

    shift_resp = client.post(
        "/api/v1/volunteers/shifts",
        json={
            "zone_name": "Stages",
            "start_time": past_start.isoformat(),
            "end_time": past_end.isoformat(),
        },
    )
    shift_id = shift_resp.json()["id"]

    # Trigger shift list (runs check_and_flag_absent_shifts)
    shifts_resp = client.get("/api/v1/volunteers/shifts")
    assert shifts_resp.status_code == 200
    shifts = shifts_resp.json()

    target_shift = next(s for s in shifts if s["id"] == shift_id)
    assert target_shift["status"] == "ABSENT"
