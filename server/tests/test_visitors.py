from datetime import datetime, timedelta


def test_visitor_pre_approval_and_qr_validation(client):
    now = datetime.utcnow()
    expected_arrival = (now - timedelta(minutes=5)).isoformat()
    expected_departure = (now + timedelta(hours=4)).isoformat()

    # 1. Create Pre-approval
    response = client.post(
        "/api/v1/visitors/pre-approval",
        json={
            "unit_number": "Unit 4B",
            "visitor_name": "Bob Smith",
            "contact_phone": "+1234567890",
            "vehicle_number": "ABC-1234",
            "assigned_parking_slot": "P-42",
            "valid_from": expected_arrival,
            "valid_until": expected_departure,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "visitor_id" in data
    assert "qr_token" in data
    visitor_id = data["visitor_id"]
    qr_payload = data["qr_token"]

    # 2. Validate QR Code at gate
    val_response = client.post(
        "/api/v1/visitors/qr/validate",
        json={"qr_token": qr_payload, "gate_id": "Main Gate"},
    )
    assert val_response.status_code == 200
    val_data = val_response.json()
    assert val_data["access_granted"] is True
    assert val_data["status"] == "VALID"
    assert val_data["visitor_name"] == "Bob Smith"
    assert val_data["assigned_parking_slot"] == "P-42"

    # 3. Attempt re-use of single-use QR token
    reuse_response = client.post(
        "/api/v1/visitors/qr/validate",
        json={"qr_token": qr_payload, "gate_id": "Main Gate"},
    )
    assert reuse_response.status_code == 200
    assert reuse_response.json()["access_granted"] is False

    # 4. Extend Stay
    extend_response = client.post(
        f"/api/v1/visitors/{visitor_id}/extend-stay", json={"extension_minutes": 120}
    )
    assert extend_response.status_code == 200
    ext_data = extend_response.json()
    assert ext_data["visitor_id"] == visitor_id
    assert "new_expected_departure" in ext_data


def test_invalid_qr_code_validation(client):
    response = client.post(
        "/api/v1/visitors/qr/validate",
        json={"qr_token": "INVALID_TAMPERED_PAYLOAD", "gate_id": "Main Gate"},
    )
    assert response.status_code == 200
    assert response.json()["access_granted"] is False
