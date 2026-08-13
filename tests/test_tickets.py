import pytest
from server.auth import generate_qr_payload


def test_ticket_validation_and_anti_passback(client):
    # 1. Create a new ticket
    ticket_code = "TKT-TEST-99"
    create_resp = client.post(
        "/api/v1/tickets",
        json={"ticket_code": ticket_code, "tier": "VIP"},
    )
    assert create_resp.status_code == 201

    payload = generate_qr_payload(ticket_code, "VIP")

    # 2. First scan -> Valid Ticket
    scan_1 = client.post(
        "/api/v1/tickets/validate",
        json={
            "ticket_code": ticket_code,
            "qr_payload": payload,
            "gate_name": "South Gate",
        },
    )
    assert scan_1.status_code == 200
    res_1 = scan_1.json()
    assert res_1["status"] == "VALID"
    assert res_1["message"] == "Valid Ticket"
    assert res_1["tier"] == "VIP"

    # 3. Second scan -> Anti-Passback Error (Already Checked In)
    scan_2 = client.post(
        "/api/v1/tickets/validate",
        json={
            "ticket_code": ticket_code,
            "qr_payload": payload,
            "gate_name": "South Gate",
        },
    )
    assert scan_2.status_code == 409
    detail = scan_2.json()["detail"]
    assert detail["status"] == "INVALID"
    assert "Already Checked In" in detail["message"]


def test_invalid_ticket_code(client):
    scan = client.post(
        "/api/v1/tickets/validate",
        json={"ticket_code": "INVALID-CODE-000", "gate_name": "North Gate"},
    )
    assert scan.status_code == 400


def test_corrupted_qr_payload(client):
    # Create ticket
    ticket_code = "TKT-TAMPER-1"
    client.post(
        "/api/v1/tickets",
        json={"ticket_code": ticket_code, "tier": "General Admission"},
    )

    # Validate with tampered signature
    tampered_payload = f"{ticket_code}:General Admission:invalid_fake_signature_hash"
    scan = client.post(
        "/api/v1/tickets/validate",
        json={
            "ticket_code": ticket_code,
            "qr_payload": tampered_payload,
            "gate_name": "Main Gate",
        },
    )
    assert scan.status_code == 400
    detail = scan.json()["detail"]
    assert "Corrupted/Tampered" in detail["message"]
