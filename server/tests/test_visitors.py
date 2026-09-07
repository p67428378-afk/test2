from datetime import datetime, timezone, timedelta


def test_create_visitor_pre_approval(client):
    now = datetime.now(timezone.utc)
    valid_from = now - timedelta(minutes=5)
    valid_until = now + timedelta(hours=4)

    payload = {
        "unit_number": "Unit 101",
        "visitor_name": "Alice Johnson",
        "contact_phone": "+15551234567",
        "vehicle_number": "ABC-1234",
        "valid_from": valid_from.isoformat(),
        "valid_until": valid_until.isoformat(),
    }

    response = client.post("/api/v1/visitors/pre-approval", json=payload)
    assert response.status_code == 201, response.text
    data = response.json()

    assert data["unit_number"] == "Unit 101"
    assert data["visitor_name"] == "Alice Johnson"
    assert data["contact_phone"] == "+15551234567"
    assert "qr_token" in data
    assert data["qr_token"].startswith("QR_")
    assert data["status"] == "ACTIVE"


def test_list_visitor_pre_approvals(client):
    response = client.get("/api/v1/visitors/pre-approval?unit_number=Unit%20101")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["unit_number"] == "Unit 101"


def test_validate_qr_entry_success_and_reuse_prevention(client):
    now = datetime.now(timezone.utc)
    valid_from = now - timedelta(minutes=10)
    valid_until = now + timedelta(hours=2)

    # 1. Create a pre-approval
    payload = {
        "unit_number": "Unit 202",
        "visitor_name": "Charlie Brown",
        "contact_phone": "+15559876543",
        "vehicle_number": "XYZ-5555",
        "valid_from": valid_from.isoformat(),
        "valid_until": valid_until.isoformat(),
    }
    create_res = client.post("/api/v1/visitors/pre-approval", json=payload)
    assert create_res.status_code == 201
    qr_token = create_res.json()["qr_token"]

    # 2. First scan -> Should grant access
    scan_payload = {
        "qr_token": qr_token,
        "gate_id": "North Gate",
        "guard_id": "Guard-1",
    }
    val_res = client.post("/api/v1/visitors/qr/validate", json=scan_payload)
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["access_granted"] is True
    assert val_data["visitor_name"] == "Charlie Brown"
    assert val_data["unit_number"] == "Unit 202"

    # 3. Second scan of the same single-use token -> Should deny access
    val_res2 = client.post("/api/v1/visitors/qr/validate", json=scan_payload)
    assert val_res2.status_code == 200
    val_data2 = val_res2.json()
    assert val_data2["access_granted"] is False
    assert val_data2["error_code"] == "TOKEN_EXPIRED_OR_USED"


def test_validate_qr_outside_validity_window(client):
    now = datetime.now(timezone.utc)
    # Expired token (valid_until in the past)
    valid_from = now - timedelta(hours=5)
    valid_until = now - timedelta(hours=1)

    payload = {
        "unit_number": "Unit 303",
        "visitor_name": "Dave Miller",
        "contact_phone": "+15554443333",
        "valid_from": valid_from.isoformat(),
        "valid_until": valid_until.isoformat(),
    }
    create_res = client.post("/api/v1/visitors/pre-approval", json=payload)
    assert create_res.status_code == 201
    qr_token = create_res.json()["qr_token"]

    scan_payload = {"qr_token": qr_token, "gate_id": "Main Gate"}
    val_res = client.post("/api/v1/visitors/qr/validate", json=scan_payload)
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["access_granted"] is False
    assert val_data["error_code"] == "TOKEN_OUTSIDE_VALIDITY_WINDOW"
