from datetime import date, timedelta


def test_create_standard_appointment(client):
    # Register visitor and get inmate
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Bob Smith",
            "national_id": "NAT-BOB-01",
            "email": "bob@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]

    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    visit_date = str(date.today() + timedelta(days=2))
    resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": visit_date,
            "start_time": "10:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Brother",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["visitor_id"] == visitor_id
    assert data["inmate_id"] == inmate_id
    assert data["slot_duration_minutes"] == 30
    assert data["status"] == "PENDING"
    assert data["security_flag_status"] == "CLEARED"


def test_create_legal_counsel_appointment_with_60m_slot(client):
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Counsel Sarah Connor",
            "national_id": "BAR-LEGAL-01",
            "email": "sarah@legalfirm.com",
            "visitor_type": "LEGAL",
        },
    )
    visitor_id = v_resp.json()["id"]

    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    visit_date = str(date.today() + timedelta(days=3))
    resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": visit_date,
            "start_time": "14:00:00",
            "slot_duration_minutes": 60,
            "relationship": "Attorney",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["slot_duration_minutes"] == 60


def test_inmate_weekly_quota_enforcement(client):
    # Inmate INV-602 has weekly_visit_limit = 1
    inmates = client.get("/api/v1/inmates").json()
    inv602 = [i for i in inmates if i["inmate_number"] == "INV-602"][0]

    v1_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Visitor One",
            "national_id": "NAT-V1",
            "email": "v1@example.com",
            "visitor_type": "STANDARD",
        },
    )
    v1_id = v1_resp.json()["id"]

    v2_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Visitor Two",
            "national_id": "NAT-V2",
            "email": "v2@example.com",
            "visitor_type": "STANDARD",
        },
    )
    v2_id = v2_resp.json()["id"]

    target_date = str(date.today() + timedelta(days=4))

    # First appointment (should succeed)
    r1 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": v1_id,
            "inmate_id": inv602["id"],
            "visit_date": target_date,
            "start_time": "09:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Friend",
        },
    )
    assert r1.status_code == 201

    # Second appointment in the same week for standard visitor on INV-602 (limit=1) -> should be rejected
    r2 = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": v2_id,
            "inmate_id": inv602["id"],
            "visit_date": target_date,
            "start_time": "11:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Cousin",
        },
    )
    assert r2.status_code == 400
    assert "weekly visit limit reached" in r2.json()["detail"].lower()


def test_appointment_approval_triggers_digital_pass(client):
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "David Miller",
            "national_id": "NAT-DM-99",
            "email": "david@example.com",
            "visitor_type": "STANDARD",
        },
    )
    visitor_id = v_resp.json()["id"]

    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[1]["id"]

    appt_resp = client.post(
        "/api/v1/appointments",
        json={
            "visitor_id": visitor_id,
            "inmate_id": inmate_id,
            "visit_date": str(date.today() + timedelta(days=1)),
            "start_time": "15:00:00",
            "slot_duration_minutes": 30,
            "relationship": "Son",
        },
    )
    appt_id = appt_resp.json()["id"]

    # Approve appointment
    patch_resp = client.patch(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "APPROVED"},
    )
    assert patch_resp.status_code == 200
    appt_data = patch_resp.json()
    assert appt_data["status"] == "APPROVED"
    assert appt_data["digital_pass"] is not None
    assert "data:image/png;base64" in appt_data["digital_pass"]["qr_code_data_url"]

    # Test PDF download endpoint
    pdf_resp = client.get(f"/api/v1/appointments/{appt_id}/digital-pass/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 100
