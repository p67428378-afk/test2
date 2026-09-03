"""Unit and integration tests for Session booking and conflict guard."""


def test_list_sessions(client):
    response = client.get("/api/v1/sessions")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) >= 1
    sample = sessions[0]
    assert "total_price" in sample
    assert "deposit_amount" in sample
    assert "customer_name" in sample


def test_book_session_with_addons_and_hold(client):
    photogs = client.get("/api/v1/photographers").json()
    pkgs = client.get("/api/v1/packages").json()
    addons = client.get("/api/v1/packages/addons").json()

    photog_id = photogs[0]["id"]
    portrait_pkg = next(p for p in pkgs if "Portrait" in p["name"])
    drone_addon = next(a for a in addons if "Drone" in a["name"])

    booking_time = "2026-07-15T11:00:00"
    payload = {
        "photographer_id": photog_id,
        "package_id": portrait_pkg["id"],
        "start_time": booking_time,
        "event_notes": "Studio headshot with drone background shots.",
        "add_on_ids": [drone_addon["id"]],
    }

    response = client.post("/api/v1/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "Pending Payment"
    expected_total = portrait_pkg["price"] + drone_addon["price"]  # 350 + 250 = 600
    assert data["total_price"] == expected_total
    assert data["deposit_amount"] == expected_total * 0.5  # 300.0
    assert data["hold_expires_at"] is not None

    # Test Double Booking Prevention: Booking same slot should return 409 Conflict
    dup_response = client.post("/api/v1/sessions", json=payload)
    assert dup_response.status_code == 409
    assert (
        "already reserved" in dup_response.json()["detail"]
        or "no longer available" in dup_response.json()["detail"]
    )


def test_update_session_status(client):
    sessions = client.get("/api/v1/sessions").json()
    session_id = sessions[0]["id"]

    response = client.patch(
        f"/api/v1/sessions/{session_id}/status",
        json={"status": "in_progress"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"
