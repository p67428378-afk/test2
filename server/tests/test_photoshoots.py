"""Unit and integration tests for Photoshoot recording and completion tracking."""


def test_list_photoshoot_records(client):
    response = client.get("/api/v1/photoshoots")
    assert response.status_code == 200
    records = response.json()
    assert len(records) >= 1
    assert "gallery_url" in records[0]


def test_photoshoot_completion_with_unpaid_warning(client):
    # Create or use a session with an unpaid remaining balance
    photogs = client.get("/api/v1/photographers").json()
    pkgs = client.get("/api/v1/packages").json()

    sess_res = client.post(
        "/api/v1/sessions",
        json={
            "photographer_id": photogs[0]["id"],
            "package_id": pkgs[0]["id"],
            "start_time": "2026-09-20T10:00:00",
            "event_notes": "Unpaid test session for photoshoot record",
            "add_on_ids": [],
        },
    )
    assert sess_res.status_code == 201
    session_id = sess_res.json()["id"]

    # Process only a 50% deposit payment so balance > 0 remains
    deposit_amount = sess_res.json()["deposit_amount"]
    client.post(
        "/api/v1/payments",
        json={
            "session_id": session_id,
            "amount": deposit_amount,
            "payment_method": "credit_card",
            "transaction_reference": f"TXN-UNPAID-{session_id[:8]}",
        },
    )

    payload = {
        "gallery_url": "https://gallery.aurastudio.com/proofs/104-wedding-edited",
        "notes": "Completed sunset session with 140 edited high-res proofs.",
        "is_completed": True,
    }
    response = client.post(
        f"/api/v1/sessions/{session_id}/photoshoot-record", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] is True
    assert data["gallery_url"] == payload["gallery_url"]
    # Since session has unpaid balance, warning flag should be True
    assert data["unpaid_balance_warning"] is True

    # Check updated session status
    sess_res = client.get(f"/api/v1/sessions/{session_id}")
    assert sess_res.status_code == 200
    assert sess_res.json()["status"] == "completed"


def test_get_photoshoot_record_by_session(client):
    sessions = client.get("/api/v1/sessions").json()
    session_id = sessions[0]["id"]

    response = client.get(f"/api/v1/sessions/{session_id}/photoshoot-record")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == session_id
