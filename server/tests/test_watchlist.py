def test_list_watchlist(client):
    resp = client.get("/api/v1/watchlist")
    assert resp.status_code == 200
    entries = resp.json()
    assert len(entries) >= 1
    ids = [e["national_id"] for e in entries]
    assert "BANNED-9999" in ids


def test_add_to_watchlist(client):
    resp = client.post(
        "/api/v1/watchlist",
        json={
            "national_id": "FLAG-4444",
            "full_name": "Dangerous Dave",
            "reason": "Threatening behavior towards staff",
            "severity_level": "HIGH",
            "flagged_by": "OFFICER-01",
            "is_active": True,
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["id"] is not None
    assert data["national_id"] == "FLAG-4444"
    assert data["severity_level"] == "HIGH"


def test_screen_visitor_endpoint(client):
    # Test screening a flagged national_id
    resp = client.post(
        "/api/v1/watchlist/screen",
        json={"national_id": "BANNED-9999"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["is_flagged"] is True
    assert "MATCH FOUND" in data["message"]

    # Test screening a clean national_id
    clean_resp = client.post(
        "/api/v1/watchlist/screen",
        json={"national_id": "CLEAN-ID-001"},
    )
    assert clean_resp.status_code == 200
    clean_data = clean_resp.json()
    assert clean_data["is_flagged"] is False
    assert "CLEARED" in clean_data["message"]


def test_deactivate_watchlist_entry_clears_visitor_flag(client):
    # Register visitor
    v_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Temporary Ban Person",
            "national_id": "TEMP-BAN-123",
            "email": "tempban@example.com",
            "visitor_type": "STANDARD",
        },
    )
    v_id = v_resp.json()["id"]

    create_resp = client.post(
        "/api/v1/watchlist",
        json={
            "national_id": "TEMP-BAN-123",
            "full_name": "Temporary Ban Person",
            "reason": "Investigation pending",
            "severity_level": "MEDIUM",
        },
    )
    entry_id = create_resp.json()["id"]

    # Check visitor is flagged
    v_get = client.get(f"/api/v1/visitors/{v_id}").json()
    assert v_get["is_watchlist_flagged"] is True

    # Delete entry
    del_resp = client.delete(f"/api/v1/watchlist/{entry_id}")
    assert del_resp.status_code == 204

    # Screen again -> should no longer be active
    screen_resp = client.post(
        "/api/v1/watchlist/screen",
        json={"national_id": "TEMP-BAN-123"},
    )
    assert screen_resp.json()["is_flagged"] is False

    # Check visitor flag is now cleared
    v_get2 = client.get(f"/api/v1/visitors/{v_id}").json()
    assert v_get2["is_watchlist_flagged"] is False
