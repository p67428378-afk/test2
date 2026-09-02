import uuid
from datetime import date, datetime, timedelta, timezone
import pytest
from server.services.qr_service import generate_pass_token


@pytest.fixture
def unique_visitor(client):
    nat_id = f"NAT-{uuid.uuid4().hex[:8]}"
    email = f"user_{uuid.uuid4().hex[:6]}@example.com"
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Test Visitor",
            "national_id": nat_id,
            "email": email,
            "phone": "+1-555-0100",
            "address": "123 Test St",
            "visitor_type": "STANDARD",
        },
    )
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
def unique_legal_visitor(client):
    nat_id = f"BAR-{uuid.uuid4().hex[:8]}"
    email = f"attorney_{uuid.uuid4().hex[:6]}@lawfirm.com"
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Attorney Jane Counsel",
            "national_id": nat_id,
            "email": email,
            "phone": "+1-555-0200",
            "address": "456 Law Blvd",
            "visitor_type": "LEGAL",
        },
    )
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
def unique_inmate(client):
    inmate_num = f"INV-{uuid.uuid4().hex[:6].upper()}"
    resp = client.post(
        "/api/v1/inmates",
        json={
            "inmate_number": inmate_num,
            "full_name": "Inmate Test",
            "cell_location": "Block C - Cell 99",
            "security_level": "MEDIUM",
            "weekly_visit_limit": 10,
            "status": "ACTIVE",
        },
    )
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
def verified_visitor(client, unique_visitor):
    verif_resp = client.post(
        "/api/v1/verifications",
        json={
            "visitor_id": unique_visitor["id"],
            "officer_id": "OFFICER-001",
            "verification_status": "VERIFIED",
            "notes": "ID document verified",
        },
    )
    assert verif_resp.status_code == 201
    return unique_visitor


@pytest.fixture
def approved_appointment(client, verified_visitor, unique_inmate):
    target_date = str(date.today() + timedelta(days=1))
    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": verified_visitor["id"],
            "inmate_id": unique_inmate["id"],
            "visit_date": target_date,
            "start_time": "10:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Sister",
        },
    )
    assert appt_resp.status_code == 201, (
        f"Failed creating appointment: {appt_resp.text}"
    )
    appt_data = appt_resp.json()

    approve_resp = client.patch(
        f"/api/v1/appointments/{appt_data['id']}/status",
        json={"status": "APPROVED"},
    )
    assert approve_resp.status_code == 200, (
        f"Failed approving appointment: {approve_resp.text}"
    )
    return approve_resp.json()


def test_tc01_register_standard_visitor(client):
    nat_id = f"NAT-{uuid.uuid4().hex[:8]}"
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Jane Doe",
            "national_id": nat_id,
            "email": f"jane_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "+1-555-1234",
            "address": "123 Maple Street",
            "visitor_type": "STANDARD",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "id" in data
    assert data["national_id"] == nat_id
    assert data["visitor_type"] == "STANDARD"
    assert data["is_watchlist_flagged"] is False
    assert data["verification_status"] == "PENDING"


def test_tc02_register_legal_counsel_visitor(client, unique_legal_visitor):
    assert "id" in unique_legal_visitor
    assert unique_legal_visitor["visitor_type"] == "LEGAL"


def test_tc03_duplicate_national_id_rejected(client):
    nat_id = f"NAT-{uuid.uuid4().hex[:8]}"
    resp1 = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Original Visitor",
            "national_id": nat_id,
            "email": f"orig_{uuid.uuid4().hex[:6]}@example.com",
        },
    )
    assert resp1.status_code == 201

    resp2 = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Duplicate Visitor",
            "national_id": nat_id.lower(),
            "email": f"dup_{uuid.uuid4().hex[:6]}@example.com",
        },
    )
    assert resp2.status_code == 400
    assert "already registered" in resp2.json()["detail"].lower()


def test_tc04_visitor_profile_retrieval(client, unique_visitor):
    resp = client.get(f"/api/v1/visitors/profile?email={unique_visitor['email']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == unique_visitor["id"]

    resp2 = client.get(
        f"/api/v1/visitors/profile?national_id={unique_visitor['national_id']}"
    )
    assert resp2.status_code == 200
    assert resp2.json()["id"] == unique_visitor["id"]


def test_tc05_visitor_list_pagination(client, unique_visitor):
    resp = client.get("/api/v1/visitors?skip=0&limit=10")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_tc06_visitor_history_retrieval(client, unique_visitor):
    resp = client.get(f"/api/v1/visitors/{unique_visitor['id']}/history")
    assert resp.status_code == 200
    data = resp.json()
    assert "visitor" in data
    assert "appointments" in data
    assert "verifications" in data
    assert "entry_exit_logs" in data


def test_tc07_approval_generates_digital_pass(client, approved_appointment):
    assert "id" in approved_appointment
    assert approved_appointment["status"] == "APPROVED"
    digital_pass = approved_appointment.get("digital_pass")
    assert digital_pass is not None, "Digital pass was not generated upon approval"
    assert "id" in digital_pass
    assert "pass_token" in digital_pass
    assert "qr_code_data_url" in digital_pass
    assert digital_pass["is_used"] is False


def test_tc08_express_qr_gate_check_in(client, approved_appointment):
    assert "id" in approved_appointment
    pass_token = approved_appointment["digital_pass"]["pass_token"]

    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 200, f"Scan failed: {scan_resp.text}"
    scan_data = scan_resp.json()
    assert "id" in scan_data
    assert scan_data["status"] == "APPROVED"
    assert scan_data["security_status"] == "CLEARED"
    assert scan_data["appointment_id"] == approved_appointment["id"]


def test_tc09_express_qr_scan_rejects_already_used_pass(client, approved_appointment):
    assert "id" in approved_appointment
    pass_token = approved_appointment["digital_pass"]["pass_token"]

    # First scan
    scan1 = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan1.status_code == 200

    # Second scan -> should be rejected
    scan2 = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan2.status_code == 400
    assert "already been used" in scan2.json()["detail"].lower()


def test_tc10_express_qr_scan_rejects_expired_pass(
    client, verified_visitor, unique_inmate
):
    target_date = str(date.today())
    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": verified_visitor["id"],
            "inmate_id": unique_inmate["id"],
            "visit_date": target_date,
            "start_time": "08:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Friend",
        },
    )
    appt_id = appt_resp.json()["id"]
    client.patch(f"/api/v1/appointments/{appt_id}/status", json={"status": "APPROVED"})

    expired_token = generate_pass_token(
        appointment_id=appt_id,
        visitor_id=verified_visitor["id"],
        inmate_id=unique_inmate["id"],
        visit_date=target_date,
        expires_at=datetime.now(timezone.utc) - timedelta(hours=2),
    )

    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": expired_token,
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 400
    assert "expired" in scan_resp.json()["detail"].lower()


def test_tc11_express_qr_scan_rejects_invalid_token(client):
    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": "forged_invalid_token_sample",
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 400
    assert "invalid" in scan_resp.json()["detail"].lower()


def test_tc12_express_qr_scan_blocks_watchlist_flagged_visitor(
    client, approved_appointment
):
    visitor_id = approved_appointment["visitor_id"]
    visitor_resp = client.get(f"/api/v1/visitors/{visitor_id}")
    visitor_data = visitor_resp.json()
    pass_token = approved_appointment["digital_pass"]["pass_token"]

    # Add visitor to watchlist
    client.post(
        "/api/v1/watchlist",
        json={
            "national_id": visitor_data["national_id"],
            "full_name": visitor_data["full_name"],
            "reason": "Security Alert Flag",
            "severity_level": "CRITICAL",
        },
    )

    # Express scan at gate -> MUST BE 403
    scan_resp = client.post(
        "/api/v1/gate/scan-qr",
        json={
            "qr_pass_token": pass_token,
            "officer_id": "OFFICER-42",
            "gate_id": "GATE-01",
        },
    )
    assert scan_resp.status_code == 403
    assert "deny entry immediately" in scan_resp.json()["detail"].lower()


def test_tc13_inmate_weekly_quota_enforcement_standard(client):
    # Inmate with limit 1
    inmate_num = f"INV-{uuid.uuid4().hex[:6].upper()}"
    inmate_resp = client.post(
        "/api/v1/inmates",
        json={
            "inmate_number": inmate_num,
            "full_name": "Quota Inmate",
            "cell_location": "Block B - Cell 1",
            "security_level": "MAXIMUM",
            "weekly_visit_limit": 1,
            "status": "ACTIVE",
        },
    )
    inmate_id = inmate_resp.json()["id"]

    v1_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Visitor A",
            "national_id": f"NAT-{uuid.uuid4().hex[:8]}",
            "email": f"va_{uuid.uuid4().hex[:6]}@example.com",
            "visitor_type": "STANDARD",
        },
    )
    v1_id = v1_resp.json()["id"]

    v2_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Visitor B",
            "national_id": f"NAT-{uuid.uuid4().hex[:8]}",
            "email": f"vb_{uuid.uuid4().hex[:6]}@example.com",
            "visitor_type": "STANDARD",
        },
    )
    v2_id = v2_resp.json()["id"]

    visit_date = str(date.today() + timedelta(days=2))

    r1 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": v1_id,
            "inmate_id": inmate_id,
            "visit_date": visit_date,
            "start_time": "09:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Friend",
        },
    )
    assert r1.status_code == 201

    r2 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": v2_id,
            "inmate_id": inmate_id,
            "visit_date": visit_date,
            "start_time": "11:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Cousin",
        },
    )
    assert r2.status_code == 400
    assert "weekly visit limit reached" in r2.json()["detail"].lower()


def test_tc14_inmate_weekly_quota_legal_counsel_extended(
    client, unique_legal_visitor, unique_inmate
):
    # Legal counsel gets up to 5 weekly visits
    visit_date = str(date.today() + timedelta(days=3))
    r = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": unique_legal_visitor["id"],
            "inmate_id": unique_inmate["id"],
            "visit_date": visit_date,
            "start_time": "14:00:00",
            "slot_duration_minutes": 60,
            "relationship": "Legal Counsel",
        },
    )
    assert r.status_code == 201
    assert r.json()["slot_duration_minutes"] == 60


def test_tc15_watchlist_auto_flag_on_registration(client):
    nat_id = f"BANNED-{uuid.uuid4().hex[:6].upper()}"
    client.post(
        "/api/v1/watchlist",
        json={
            "national_id": nat_id,
            "full_name": "Banned Suspect",
            "reason": "Contraband smuggling",
            "severity_level": "HIGH",
        },
    )

    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Banned Suspect",
            "national_id": nat_id,
            "email": f"banned_{uuid.uuid4().hex[:6]}@example.com",
            "visitor_type": "STANDARD",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["is_watchlist_flagged"] is True


def test_tc16_watchlist_screen_endpoint(client):
    screen_resp = client.post(
        "/api/v1/watchlist/screen",
        json={"national_id": "BANNED-9999"},
    )
    assert screen_resp.status_code == 200
    assert screen_resp.json()["is_flagged"] is True


def test_tc17_digital_pass_pdf_download(client, approved_appointment):
    appt_id = approved_appointment["id"]
    pdf_resp = client.get(f"/api/v1/appointments/{appt_id}/digital-pass/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 100


def test_tc18_officer_identity_verification(client, unique_visitor):
    resp = client.post(
        "/api/v1/verifications",
        json={
            "visitor_id": unique_visitor["id"],
            "officer_id": "OFFICER-77",
            "verification_status": "VERIFIED",
            "notes": "State ID card verified",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["verification_status"] == "VERIFIED"


def test_tc19_manual_gate_entry_and_exit(client, approved_appointment):
    appt_id = approved_appointment["id"]
    in_resp = client.post(
        "/api/v1/entry-exit-logs/check-in",
        json={"appointment_id": appt_id, "officer_id": "OFFICER-77"},
    )
    assert in_resp.status_code == 201
    assert in_resp.json()["entry_method"] == "MANUAL"

    out_resp = client.post(
        "/api/v1/entry-exit-logs/check-out",
        json={"appointment_id": appt_id, "officer_id": "OFFICER-77"},
    )
    assert out_resp.status_code == 200
    assert out_resp.json()["check_out_time"] is not None
