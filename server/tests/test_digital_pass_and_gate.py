from datetime import date, datetime, timedelta, timezone
from server.services.qr_service import generate_pass_token


def test_express_qr_scan_success(client):
    # 1. Setup approved appointment
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Gate Test Visitor",
            "national_id": "GATE-VIS-001",
            "email": "gatevis@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]

    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": str(date.today()),
            "start_time": "10:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Sister",
        },
    )
    appt_id = appt_resp.json()["id"]

    # Approve to generate digital pass
    approve_resp = client.patch(
        f"/api/v1/appointments/{appt_id}/status", json={"status": "APPROVED"}
    )
    pass_token = approve_resp.json()["digital_pass"]["pass_token"]

    # 2. Express QR Scan at Gate
    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-007",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 200
    scan_data = scan_resp.json()
    assert scan_data["status"] == "APPROVED"
    assert scan_data["appointment_id"] == appt_id
    assert scan_data["security_status"] == "CLEARED"
    assert scan_data["visitor_name"] == "Gate Test Visitor"

    # 3. Scanning the same pass again should be rejected as already used
    duplicate_scan = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-007",
            "gate_id": "GATE-01",
        },
    )
    assert duplicate_scan.status_code == 400
    assert "already been used" in duplicate_scan.json()["detail"].lower()


def test_express_qr_scan_invalid_token(client):
    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": "forged.fake.token",
            "officer_id": "OFFICER-007",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 400
    assert "invalid" in scan_resp.json()["detail"].lower()


def test_express_qr_scan_expired_token(client):
    # Setup appointment
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Expired Pass Visitor",
            "national_id": "EXP-VIS-002",
            "email": "exp@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]
    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": str(date.today()),
            "start_time": "08:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Friend",
        },
    )
    appt_id = appt_resp.json()["id"]
    client.patch(f"/api/v1/appointments/{appt_id}/status", json={"status": "APPROVED"})

    # Manually generate an expired token (expired 1 hour ago)
    expired_token = generate_pass_token(
        appointment_id=appt_id,
        visitor_id=visitor_id,
        inmate_id=inmate_id,
        visit_date=str(date.today()),
        expires_at=datetime.now(timezone.utc) - timedelta(hours=1),
    )

    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": expired_token,
            "officer_id": "OFFICER-007",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 400
    assert "expired" in scan_resp.json()["detail"].lower()


def test_express_qr_scan_banned_visitor_immediate_block(client):
    # Register visitor
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Infiltrator Visitor",
            "national_id": "BANNED-SUSPECT-99",
            "email": "suspect@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]
    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": str(date.today()),
            "start_time": "12:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Associate",
        },
    )
    appt_id = appt_resp.json()["id"]
    approve_resp = client.patch(
        f"/api/v1/appointments/{appt_id}/status", json={"status": "APPROVED"}
    )
    pass_token = approve_resp.json()["digital_pass"]["pass_token"]

    # Now, add visitor's national ID to Watchlist before they arrive at the gate
    client.post(
        "/api/v1/watchlist",
        json={
            "national_id": "BANNED-SUSPECT-99",
            "full_name": "Infiltrator Visitor",
            "reason": "Caught attempting smuggling at Gate 2",
            "severity_level": "CRITICAL",
        },
    )

    # Express scan at gate -> MUST BE BLOCKED (403 Forbidden)
    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-007",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 403
    assert "deny entry immediately" in scan_resp.json()["detail"].lower()


def test_verifications_and_manual_entry_exit(client):
    # Register visitor
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Manual Gate Visitor",
            "national_id": "MAN-VIS-101",
            "email": "manual@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]

    # Officer identity verification
    verif_resp = client.post(
        "/api/v1/verifications",
        json={
            "visitor_id": visitor_id,
            "officer_id": "OFFICER-007",
            "verification_status": "VERIFIED",
            "notes": "State Driver License verified with photo match",
        },
    )
    assert verif_resp.status_code == 201
    assert verif_resp.json()["verification_status"] == "VERIFIED"

    # Create appointment
    inmates = client.get("/api/v1/inmates").json()
    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmates[0]["id"],
            "visit_date": str(date.today()),
            "start_time": "16:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Father",
        },
    )
    appt_id = appt_resp.json()["id"]

    # Manual check-in
    checkin_resp = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appt_id, "officer_id": "OFFICER-007"},
    )
    assert checkin_resp.status_code == 201
    assert checkin_resp.json()["entry_method"] == "MANUAL"
    assert checkin_resp.json()["check_in_time"] is not None

    # Check-out
    checkout_resp = client.post(
        "/api/v1/entry-exit-logs/check-out",
        json={"appointment_id": appt_id, "officer_id": "OFFICER-007"},
    )
    assert checkout_resp.status_code == 200
    assert checkout_resp.json()["check_out_time"] is not None
