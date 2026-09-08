from datetime import datetime, timedelta


def test_recurring_pass_lifecycle(client):
    now = datetime.utcnow()
    start_date = now.isoformat()
    end_date = (now + timedelta(days=180)).isoformat()

    # 1. Create Recurring Pass
    response = client.post(
        "/api/v1/visitors/recurring",
        json={
            "visitor_name": "Carol Cleaner",
            "service_type": "Cleaning Staff",
            "days_of_week": "MON,WED,FRI",
            "start_date": start_date,
            "end_date": end_date,
            "access_start_time": "09:00",
            "access_end_time": "12:00",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["visitor_name"] == "Carol Cleaner"
    assert data["is_active"] is True
    pass_id = data["id"]

    # 2. List Recurring Passes
    list_response = client.get("/api/v1/visitors/recurring")
    assert list_response.status_code == 200
    passes = list_response.json()
    assert len(passes) >= 1

    # 3. Revoke Recurring Pass
    revoke_response = client.delete(f"/api/v1/visitors/recurring/{pass_id}")
    assert revoke_response.status_code == 200
    r_data = revoke_response.json()
    assert r_data["recurring_pass_id"] == pass_id
    assert r_data["is_active"] is False
    assert "revoked" in r_data["message"].lower()


def test_revoke_non_existent_recurring_pass(client):
    response = client.delete("/api/v1/visitors/recurring/invalid-id-999")
    assert response.status_code == 404
