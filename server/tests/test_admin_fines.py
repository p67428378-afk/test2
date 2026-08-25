from datetime import datetime, timezone, timedelta


def test_admin_create_fine_success(client, admin_headers):
    due = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    payload = {
        "license_plate": "JKL-9999",
        "violation_type": "Expired Meter",
        "location": "Downtown Zone 1",
        "amount": 45.0,
        "due_date": due,
    }
    response = client.post("/api/v1/admin/fines", json=payload, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["license_plate"] == "JKL-9999"
    assert data["status"] == "UNPAID"
    assert data["ticket_number"].startswith("FN-")
    assert "id" in data


def test_admin_create_fine_unauthorized(client, user_headers):
    due = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    payload = {
        "license_plate": "JKL-9999",
        "violation_type": "Expired Meter",
        "location": "Downtown Zone 1",
        "amount": 45.0,
        "due_date": due,
    }

    # No auth header -> 401
    resp1 = client.post("/api/v1/admin/fines", json=payload)
    assert resp1.status_code == 401

    # Non-admin user header -> 403
    resp2 = client.post("/api/v1/admin/fines", json=payload, headers=user_headers)
    assert resp2.status_code == 403


def test_admin_create_fine_invalid_amount(client, admin_headers):
    due = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    payload = {
        "license_plate": "JKL-9999",
        "violation_type": "Expired Meter",
        "location": "Downtown Zone 1",
        "amount": -10.0,
        "due_date": due,
    }
    response = client.post("/api/v1/admin/fines", json=payload, headers=admin_headers)
    assert response.status_code in [400, 422]


def test_admin_update_fine_status(client, admin_headers):
    # First search for existing ticket
    resp_search = client.get("/api/v1/fines/search?ticket_number=FN-10001")
    fine_id = resp_search.json()[0]["id"]

    update_payload = {
        "status": "PAID",
        "transaction_reference": "TXN-8821",
        "notes": "Manual bank transfer clearance verified",
    }
    response = client.put(
        f"/api/v1/admin/fines/{fine_id}", json=update_payload, headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PAID"
    assert data["transaction_reference"] == "TXN-8821"
    assert data["payment_timestamp"] is not None


def test_admin_void_fine_success(client, admin_headers):
    resp_search = client.get("/api/v1/fines/search?license_plate=ABC-1234")
    fine_id = resp_search.json()[0]["id"]

    response = client.delete(
        f"/api/v1/admin/fines/{fine_id}?notes=Dismissed+by+magistrate+court",
        headers=admin_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VOIDED"


def test_admin_list_audit_logs(client, admin_headers):
    # Ensure at least one audit log is created in this session
    due = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    client.post(
        "/api/v1/admin/fines",
        json={
            "license_plate": "AUD-100",
            "violation_type": "Illegal Parking",
            "location": "Main St",
            "amount": 25.0,
            "due_date": due,
        },
        headers=admin_headers,
    )

    response = client.get("/api/v1/admin/audit-logs", headers=admin_headers)
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)
    assert len(logs) >= 1
    assert "action" in logs[0]
    assert "actor_id" in logs[0]
