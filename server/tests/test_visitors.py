def test_register_standard_visitor(client):
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Alice Johnson",
            "national_id": "NAT-1001",
            "email": "alice@example.com",
            "phone": "+1-555-0101",
            "address": "123 Elm St, Cityville",
            "visitor_type": "STANDARD",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["full_name"] == "Alice Johnson"
    assert data["national_id"] == "NAT-1001"
    assert data["visitor_type"] == "STANDARD"
    assert data["is_watchlist_flagged"] is False
    assert data["verification_status"] == "PENDING"


def test_register_legal_visitor(client):
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Attorney Robert Vance",
            "national_id": "BAR-5002",
            "email": "vance@lawfirm.com",
            "phone": "+1-555-0202",
            "address": "456 Legal Way, Metro City",
            "visitor_type": "LEGAL",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["visitor_type"] == "LEGAL"


def test_duplicate_national_id_rejected(client):
    # Register first
    client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Alice Original",
            "national_id": "NAT-DUP-01",
            "email": "alice.orig@example.com",
            "phone": "+1-555-0101",
        },
    )
    # Try registering again with the same national_id
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Alice Clone",
            "national_id": "NAT-DUP-01",
            "email": "alice.clone@example.com",
            "phone": "+1-555-0101",
        },
    )
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"].lower()


def test_watchlist_auto_flag_on_registration(client):
    # 'BANNED-9999' is seeded on the watchlist
    resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Mark Criminal",
            "national_id": "BANNED-9999",
            "email": "mark.crim@example.com",
            "phone": "+1-555-9999",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["is_watchlist_flagged"] is True


def test_list_and_get_visitor(client):
    client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "List Visitor",
            "national_id": "NAT-LIST-01",
            "email": "listvis@example.com",
        },
    )
    resp = client.get("/api/v1/visitors")
    assert resp.status_code == 200
    visitors = resp.json()
    assert len(visitors) >= 1

    visitor_id = visitors[0]["id"]
    get_resp = client.get(f"/api/v1/visitors/{visitor_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == visitor_id


def test_visitor_history_endpoint(client):
    reg_resp = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "History Visitor",
            "national_id": "NAT-HIST-01",
            "email": "histvis@example.com",
        },
    )
    visitor_id = reg_resp.json()["id"]

    hist_resp = client.get(f"/api/v1/visitors/{visitor_id}/history")
    assert hist_resp.status_code == 200
    data = hist_resp.json()
    assert "visitor" in data
    assert "appointments" in data
    assert "verifications" in data
    assert "entry_exit_logs" in data
