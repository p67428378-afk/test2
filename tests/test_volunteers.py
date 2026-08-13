from datetime import datetime, timedelta
import pytest


def test_volunteer_flow_and_checkin(client):
    # Get seeded user ID via login/me
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "coordinator@example.com", "password": "testpassword"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me_resp = client.get("/api/v1/auth/me", headers=headers)
    user_id = me_resp.json()["id"]

    # 1. Create Volunteer
    vol_resp = client.post(
        "/api/v1/volunteers",
        json={
            "user_id": user_id,
            "phone": "555-0199",
            "assigned_zone": "North Gate",
        },
        headers=headers,
    )
    assert vol_resp.status_code == 201
    volunteer = vol_resp.json()
    assert volunteer["user_id"] == user_id

    # 2. Assign Shift
    now = datetime.utcnow()
    start_time = now + timedelta(hours=1)
    end_time = start_time + timedelta(hours=4)

    shift_resp = client.post(
        "/api/v1/volunteers/shifts",
        json={
            "volunteer_id": volunteer["id"],
            "zone": "North Gate",
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        },
        headers=headers,
    )
    assert shift_resp.status_code == 201
    shift = shift_resp.json()
    assert shift["status"] == "PENDING"

    # 3. Check-In
    checkin_resp = client.post(
        "/api/v1/volunteers/check-in",
        json={
            "shift_id": shift["id"],
            "volunteer_id": volunteer["id"],
        },
        headers=headers,
    )
    assert checkin_resp.status_code == 200
    checked_shift = checkin_resp.json()
    assert checked_shift["status"] == "ACTIVE"
    assert checked_shift["check_in_time"] is not None

    # 4. Overlapping Shift Assignment Prevention
    overlap_resp = client.post(
        "/api/v1/volunteers/shifts",
        json={
            "volunteer_id": volunteer["id"],
            "zone": "South Gate",
            "start_time": (start_time + timedelta(hours=1)).isoformat(),
            "end_time": (end_time + timedelta(hours=1)).isoformat(),
        },
        headers=headers,
    )
    assert overlap_resp.status_code == 409
