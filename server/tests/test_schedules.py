def test_get_dashboard_schedules(client, auth_headers):
    response = client.get("/api/v1/schedules/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert "overdue" in data
    assert "due_today" in data
    assert "upcoming" in data
    assert "summary_stats" in data

    stats = data["summary_stats"]
    assert "overdue_count" in stats
    assert "due_today_count" in stats
    assert "total_plants" in stats
    assert "healthy_count" in stats
    assert "care_score" in stats
    assert stats["total_plants"] >= 1


def test_get_watering_notifications(client, auth_headers):
    response = client.get("/api/v1/schedules/notifications", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert "total_alerts" in data
    assert "overdue_count" in data
    assert "due_today_count" in data
    assert "alerts" in data
    assert isinstance(data["alerts"], list)


def test_trigger_reminder_notifications(client, auth_headers):
    response = client.post("/api/v1/schedules/notifications/send", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "sent"
    assert "Dispatched" in data["message"]
    assert "test@example.com" in data["recipients"]
