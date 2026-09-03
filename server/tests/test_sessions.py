from datetime import date, timedelta


def test_session_booking_with_addons_and_double_booking_prevention(
    client, customer_headers, admin_headers
):
    photo_id = "22222222-2222-2222-2222-222222222222"
    pkg_id = "33333333-3333-3333-3333-333333333331"  # Portrait $350, 60 mins

    booking_date = date.today() + timedelta(days=20)
    start_time_iso = f"{booking_date.isoformat()}T15:00:00"

    # 1. Book session with Add-ons (Drone: $250) -> Total $600, Deposit $300
    payload = {
        "photographer_id": photo_id,
        "package_id": pkg_id,
        "start_time": start_time_iso,
        "event_notes": "Senior graduation portraits",
        "add_on_ids": ["addon-drone"],
    }
    res = client.post("/api/v1/sessions", json=payload, headers=customer_headers)
    assert res.status_code == 201
    sess_data = res.json()
    assert sess_data["status"] == "pending_payment"
    assert sess_data["total_price"] == 600.00
    assert sess_data["deposit_amount"] == 300.00
    assert sess_data["hold_expires_at"] is not None
    assert "Drone Aerial Photography" in sess_data["add_ons"]
    session_id = sess_data["id"]

    # 2. Double-Booking Prevention: Attempt to book overlapping time slot
    overlap_payload = {
        "photographer_id": photo_id,
        "package_id": pkg_id,
        "start_time": start_time_iso,
        "event_notes": "Conflicting attempt",
    }
    res_conflict = client.post(
        "/api/v1/sessions", json=overlap_payload, headers=admin_headers
    )
    assert res_conflict.status_code == 409
    assert (
        "Selected photographer time slot is no longer available"
        in res_conflict.json()["detail"]
    )

    # 3. List Sessions
    res_list = client.get("/api/v1/sessions", headers=customer_headers)
    assert res_list.status_code == 200
    sessions = res_list.json()
    assert len(sessions) >= 1
    assert any(s["id"] == session_id for s in sessions)

    # 4. Get Session Details
    res_detail = client.get(f"/api/v1/sessions/{session_id}", headers=customer_headers)
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["id"] == session_id
    assert detail["package_name"] == "Portrait Package"
    assert detail["remaining_balance"] == 600.00

    # 5. Patch Session Status
    res_patch = client.patch(
        f"/api/v1/sessions/{session_id}/status",
        json={"status": "confirmed"},
        headers=admin_headers,
    )
    assert res_patch.status_code == 200
    assert res_patch.json()["status"] == "confirmed"
