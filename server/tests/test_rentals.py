from datetime import datetime, timedelta, timezone


def test_create_rental_reservation(client, user_token_headers, sample_equipment):
    now = datetime.now(timezone.utc)
    start_date = (now + timedelta(days=1)).isoformat()
    end_date = (now + timedelta(days=3)).isoformat()

    payload = {
        "equipment_id": sample_equipment.id,
        "start_date": start_date,
        "end_date": end_date,
        "payment_method_token": "pm_mock_token_123",
    }

    response = client.post("/api/v1/rentals", json=payload, headers=user_token_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["equipment_id"] == sample_equipment.id
    assert data["status"] == "RESERVED"


def test_list_user_rentals(client, user_token_headers):
    response = client.get("/api/v1/rentals", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_transition_rental_status(client, user_token_headers, sample_equipment):
    now = datetime.now(timezone.utc)
    start_date = (now + timedelta(days=5)).isoformat()
    end_date = (now + timedelta(days=7)).isoformat()

    res = client.post(
        "/api/v1/rentals",
        json={
            "equipment_id": sample_equipment.id,
            "start_date": start_date,
            "end_date": end_date,
            "payment_method_token": "pm_mock_token_123",
        },
        headers=user_token_headers,
    )
    rental_id = res.json()["id"]

    # Transition to CHECKED_OUT
    patch_res = client.patch(
        f"/api/v1/rentals/{rental_id}/status",
        json={"status": "CHECKED_OUT"},
        headers=user_token_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "CHECKED_OUT"


def test_trigger_notifications_and_overdue(client, admin_token_headers):
    reminders_res = client.post(
        "/api/v1/rentals/notifications/trigger-reminders", headers=admin_token_headers
    )
    assert reminders_res.status_code == 200
    assert "triggered_count" in reminders_res.json()

    overdue_res = client.post(
        "/api/v1/rentals/notifications/check-overdue", headers=admin_token_headers
    )
    assert overdue_res.status_code == 200
    assert "flagged_count" in overdue_res.json()
