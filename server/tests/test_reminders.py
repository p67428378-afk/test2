from datetime import date, timedelta


def test_expiry_tracking_and_reminders(client, auth_headers):
    today = date.today()

    # 1. Create a contract expiring in 20 days (should trigger 30d/60d/90d milestone)
    expiring_soon = today + timedelta(days=20)
    c1_resp = client.post(
        "/api/v1/contracts",
        json={
            "title": "Expiring Soon Contract",
            "vendor_name": "Acme Corp",
            "effective_date": (today - timedelta(days=300)).isoformat(),
            "termination_date": expiring_soon.isoformat(),
            "total_value": 10000.0,
        },
        headers=auth_headers,
    )
    c1_id = c1_resp.json()["id"]

    # Transition c1 to Executed so it's active
    client.post(
        f"/api/v1/contracts/{c1_id}/approvals",
        json={"action": "SUBMIT"},
        headers=auth_headers,
    )
    client.post(
        f"/api/v1/contracts/{c1_id}/approvals",
        json={"action": "APPROVE"},
        headers=auth_headers,
    )
    client.post(
        f"/api/v1/contracts/{c1_id}/approvals",
        json={"action": "APPROVE"},
        headers=auth_headers,
    )
    client.post(
        f"/api/v1/contracts/{c1_id}/approvals",
        json={"action": "EXECUTE"},
        headers=auth_headers,
    )

    # 2. Create an already expired contract (termination date in past)
    expired_date = today - timedelta(days=5)
    c2_resp = client.post(
        "/api/v1/contracts",
        json={
            "title": "Past Expiry Contract",
            "vendor_name": "Acme Corp",
            "effective_date": (today - timedelta(days=365)).isoformat(),
            "termination_date": expired_date.isoformat(),
            "total_value": 5000.0,
        },
        headers=auth_headers,
    )
    c2_id = c2_resp.json()["id"]

    # Trigger process
    proc_resp = client.post("/api/v1/reminders/process")
    assert proc_resp.status_code == 200
    res = proc_resp.json()
    assert res["processed_contracts"] >= 2
    assert res["reminders_sent"] >= 1
    assert res["expired_contracts"] >= 1

    # Verify c2 status changed to Expired
    get_c2 = client.get(f"/api/v1/contracts/{c2_id}", headers=auth_headers)
    assert get_c2.json()["status"] == "Expired"

    # List reminders
    rem_list = client.get("/api/v1/reminders", headers=auth_headers)
    assert rem_list.status_code == 200
    reminders = rem_list.json()
    assert len(reminders) >= 1
