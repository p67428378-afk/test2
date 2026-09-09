from datetime import datetime, timezone, timedelta


def test_dashboard_schedules_feed_and_notifications(client, auth_headers):
    # 1. Create an upcoming plant (due in 5 days)
    client.post(
        "/api/v1/plants",
        json={
            "nickname": "Upcoming Plant",
            "location": "Bedroom",
            "watering_interval_days": 5,
            "notifications_enabled": True,
        },
        headers=auth_headers,
    )

    # 2. Create an overdue plant (last watered 10 days ago, interval 3 days -> due 7 days ago)
    past_watered = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
    client.post(
        "/api/v1/plants",
        json={
            "nickname": "Overdue Plant",
            "location": "Kitchen",
            "watering_interval_days": 3,
            "last_watered": past_watered,
            "notifications_enabled": True,
        },
        headers=auth_headers,
    )

    # 3. Create a plant due today (last watered 7 days ago, interval 7 days -> due today)
    today_watered = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    client.post(
        "/api/v1/plants",
        json={
            "nickname": "Due Today Plant",
            "location": "Hallway",
            "watering_interval_days": 7,
            "last_watered": today_watered,
            "notifications_enabled": True,
        },
        headers=auth_headers,
    )

    # 4. Create a muted overdue plant (notifications_enabled=False)
    client.post(
        "/api/v1/plants",
        json={
            "nickname": "Muted Overdue Plant",
            "location": "Basement",
            "watering_interval_days": 2,
            "last_watered": past_watered,
            "notifications_enabled": False,
        },
        headers=auth_headers,
    )

    # Fetch dashboard
    dash_res = client.get("/api/v1/schedules/dashboard", headers=auth_headers)
    assert dash_res.status_code == 200
    data = dash_res.json()

    assert "due_today" in data
    assert "overdue" in data
    assert "upcoming" in data
    assert "summary_stats" in data

    stats = data["summary_stats"]
    assert stats["total_plants"] >= 4
    assert stats["overdue_count"] >= 2
    assert stats["due_today_count"] >= 1
    assert stats["healthy_count"] >= 1
    assert "care_score" in stats

    # Test notifications endpoint
    notif_res = client.get("/api/v1/schedules/notifications", headers=auth_headers)
    assert notif_res.status_code == 200
    notif_data = notif_res.json()
    assert notif_data["total_alerts"] >= 2
    # Ensure muted plant is not included in notifications
    notif_names = [n["nickname"] for n in notif_data["notifications"]]
    assert "Overdue Plant" in notif_names
    assert "Due Today Plant" in notif_names
    assert "Muted Overdue Plant" not in notif_names

    # Test trigger send daily notification
    send_res = client.post("/api/v1/schedules/notifications/send", headers=auth_headers)
    assert send_res.status_code == 200
    assert send_res.json()["total_alerts"] == notif_data["total_alerts"]
