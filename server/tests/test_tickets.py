from datetime import datetime
from fastapi.testclient import TestClient
from server.security import encrypt_qr_payload


def test_ticket_validation_and_duplicate_scan_blocking(client: TestClient):
    # 1. Create a valid ticket
    t_code = "T-TEST-1001"
    create_resp = client.post(
        "/api/v1/tickets", json={"ticket_code": t_code, "tier": "General Admission"}
    )
    assert create_resp.status_code == 201

    # 2. First scan -> ACCESS_GRANTED (200 OK)
    val_resp1 = client.post(
        "/api/v1/tickets/validate", json={"qr_payload": t_code, "gate_id": "Gate-Main"}
    )
    assert val_resp1.status_code == 200
    res1 = val_resp1.json()
    assert res1["status"] == "ACCESS_GRANTED"
    assert res1["tier"] == "General Admission"

    # 3. Second scan 10s later -> 409 Conflict "Ticket Already Used"
    val_resp2 = client.post(
        "/api/v1/tickets/validate", json={"qr_payload": t_code, "gate_id": "Gate-Main"}
    )
    assert val_resp2.status_code == 409
    assert "already used" in val_resp2.json()["detail"].lower()


def test_encrypted_qr_payload_validation(client: TestClient):
    t_code = "T-ENC-2002"
    client.post("/api/v1/tickets", json={"ticket_code": t_code, "tier": "VIP Pass"})

    # Encrypt QR payload
    encrypted_payload = encrypt_qr_payload(t_code, tier="VIP Pass")

    val_resp = client.post(
        "/api/v1/tickets/validate",
        json={"qr_payload": encrypted_payload, "gate_id": "Gate-VIP"},
    )
    assert val_resp.status_code == 200
    res = val_resp.json()
    assert res["status"] == "ACCESS_GRANTED"
    assert res["tier"] == "VIP Pass"


def test_offline_ticket_sync(client: TestClient):
    t_code1 = "T-SYNC-3001"
    t_code2 = "T-SYNC-3002"
    client.post(
        "/api/v1/tickets", json={"ticket_code": t_code1, "tier": "General Admission"}
    )
    client.post(
        "/api/v1/tickets", json={"ticket_code": t_code2, "tier": "General Admission"}
    )

    now = datetime.utcnow().isoformat()
    sync_resp = client.post(
        "/api/v1/tickets/sync",
        json={
            "scanned_tickets": [
                {"ticket_code": t_code1, "gate_id": "Gate-2", "scanned_at": now},
                {"ticket_code": t_code2, "gate_id": "Gate-2", "scanned_at": now},
            ]
        },
    )
    assert sync_resp.status_code == 200
    res = sync_resp.json()
    assert res["synchronized_count"] == 2
    assert res["rejected_count"] == 0
