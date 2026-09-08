from datetime import datetime, timedelta


def test_overstay_detection(client):
    now = datetime.utcnow()
    valid_from = (now - timedelta(minutes=10)).isoformat()
    valid_until = (now + timedelta(hours=2)).isoformat()

    # 1. Pre-approve visitor
    pre_app_response = client.post(
        "/api/v1/visitors/pre-approval",
        json={
            "unit_number": "Unit 4B",
            "visitor_name": "Overstaying Dave",
            "contact_phone": "+1987654321",
            "vehicle_number": "XYZ-999",
            "assigned_parking_slot": "P-10",
            "valid_from": valid_from,
            "valid_until": valid_until,
        },
    )
    assert pre_app_response.status_code == 201
    qr_payload = pre_app_response.json()["qr_token"]

    # 2. Gate entry validation (logs entry and allocation)
    val_response = client.post(
        "/api/v1/visitors/qr/validate",
        json={"qr_token": qr_payload, "gate_id": "Main Gate"},
    )
    assert val_response.status_code == 200
    assert val_response.json()["access_granted"] is True

    # 3. Query Active Overstays/Allocations
    overstay_response = client.get("/api/v1/visitors/overstay/active")
    assert overstay_response.status_code == 200
    items = overstay_response.json()
    assert len(items) >= 1

    dave_item = next(
        (item for item in items if item["visitor_name"] == "Overstaying Dave"), None
    )
    assert dave_item is not None
    assert dave_item["vehicle_number"] == "XYZ-999"
    assert dave_item["slot_number"] == "P-10"
