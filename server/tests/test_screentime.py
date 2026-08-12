from datetime import datetime, timedelta


def get_auth_headers(client, email="test@example.com", password="testpassword"):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_log_screentime_session_success(client):
    headers = get_auth_headers(client)

    start = datetime.utcnow() - timedelta(minutes=45)
    end = datetime.utcnow()

    session_data = {
        "app_name": "Reading Docs",
        "category": "Productivity",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
    }

    response = client.post(
        "/api/v1/screentime/sessions", json=session_data, headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["app_name"] == "Reading Docs"
    assert data["category"] == "Productivity"
    assert data["duration_seconds"] == 2700
    assert "id" in data
    assert "user_id" in data


def test_log_screentime_session_default_uncategorized(client):
    headers = get_auth_headers(client)

    start = datetime.utcnow() - timedelta(minutes=15)
    end = datetime.utcnow()

    session_data = {
        "app_name": "Unknown App",
        "category": "",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
    }

    response = client.post(
        "/api/v1/screentime/sessions", json=session_data, headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["app_name"] == "Unknown App"
    assert data["category"] == "Uncategorized"


def test_log_screentime_session_invalid_interval(client):
    headers = get_auth_headers(client)

    start = datetime.utcnow()
    end = datetime.utcnow() - timedelta(minutes=10)

    session_data = {
        "app_name": "Invalid App",
        "category": "Test",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
    }

    response = client.post(
        "/api/v1/screentime/sessions", json=session_data, headers=headers
    )
    assert response.status_code == 400
    assert (
        "end_time must be greater than or equal to start_time"
        in response.json()["detail"]
    )


def test_list_and_delete_screentime_sessions(client):
    headers = get_auth_headers(client)

    # Log two sessions
    now = datetime.utcnow()
    s1 = {
        "app_name": "VS Code",
        "category": "Productivity",
        "start_time": (now - timedelta(minutes=60)).isoformat(),
        "end_time": now.isoformat(),
    }
    resp1 = client.post("/api/v1/screentime/sessions", json=s1, headers=headers)
    assert resp1.status_code == 201
    s1_id = resp1.json()["id"]

    # List sessions
    resp_list = client.get("/api/v1/screentime/sessions", headers=headers)
    assert resp_list.status_code == 200
    assert len(resp_list.json()) >= 1

    # Delete single session
    del_resp = client.delete(f"/api/v1/screentime/sessions/{s1_id}", headers=headers)
    assert del_resp.status_code == 204


def test_screentime_analytics(client):
    headers = get_auth_headers(client)

    # Clear previous history
    client.delete("/api/v1/screentime/clear", headers=headers)

    # Empty analytics
    resp = client.get("/api/v1/screentime/analytics?period=daily", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_screen_time_seconds"] == 0
    assert data["top_applications"] == []
    assert data["category_breakdown"] == []

    # Add sessions
    now = datetime.utcnow()
    client.post(
        "/api/v1/screentime/sessions",
        json={
            "app_name": "Twitter",
            "category": "Social Media",
            "start_time": (now - timedelta(minutes=90)).isoformat(),
            "end_time": now.isoformat(),
        },
        headers=headers,
    )
    client.post(
        "/api/v1/screentime/sessions",
        json={
            "app_name": "Docs",
            "category": "Productivity",
            "start_time": (now - timedelta(minutes=180)).isoformat(),
            "end_time": (now - timedelta(minutes=90)).isoformat(),
        },
        headers=headers,
    )

    # Populated analytics
    resp = client.get("/api/v1/screentime/analytics?period=daily", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert (
        data["total_screen_time_seconds"] == 10800
    )  # (90 + 90) * 60 = 10800 seconds (3 hrs)
    assert len(data["top_applications"]) == 2
    assert len(data["category_breakdown"]) == 2


def test_usage_limits_and_alert_triggering(client):
    headers = get_auth_headers(client)

    # Clear previous history and limits
    client.delete("/api/v1/screentime/clear", headers=headers)

    # Set daily limit for Social Media: 120 minutes (3600 * 2 = 7200 seconds)
    limit_data = {"category_or_app": "Social Media", "daily_limit_seconds": 7200}
    lim_resp = client.post(
        "/api/v1/screentime/limits", json=limit_data, headers=headers
    )
    assert lim_resp.status_code == 200
    assert lim_resp.json()["daily_limit_seconds"] == 7200

    # Get limits
    list_lim = client.get("/api/v1/screentime/limits", headers=headers)
    assert list_lim.status_code == 200
    assert len(list_lim.json()) >= 1

    # Log session for Social Media reaching 96 minutes (5760 seconds -> 80% threshold)
    now = datetime.utcnow()
    sess_data = {
        "app_name": "Instagram",
        "category": "Social Media",
        "start_time": (now - timedelta(seconds=5760)).isoformat(),
        "end_time": now.isoformat(),
    }
    s_resp = client.post("/api/v1/screentime/sessions", json=sess_data, headers=headers)
    assert s_resp.status_code == 201
    alerts = s_resp.json()["alerts_triggered"]
    assert len(alerts) >= 1
    assert alerts[0]["threshold"] in ("80%", "100%")

    # Delete limit
    limit_id = lim_resp.json()["id"]
    del_lim = client.delete(f"/api/v1/screentime/limits/{limit_id}", headers=headers)
    assert del_lim.status_code == 204


def test_privacy_controls_and_export(client):
    headers = get_auth_headers(client)

    # Log a session
    now = datetime.utcnow()
    client.post(
        "/api/v1/screentime/sessions",
        json={
            "app_name": "Browser",
            "category": "Productivity",
            "start_time": (now - timedelta(minutes=30)).isoformat(),
            "end_time": now.isoformat(),
        },
        headers=headers,
    )

    # Export usage data
    exp_resp = client.get("/api/v1/screentime/export", headers=headers)
    assert exp_resp.status_code == 200
    exp_data = exp_resp.json()
    assert exp_data["status"] == "completed"
    assert exp_data["total_records"] >= 1
    assert "sessions" in exp_data

    # Clear all session history
    clear_resp = client.delete("/api/v1/screentime/clear", headers=headers)
    assert clear_resp.status_code == 200

    # Verify export is now 0 records
    exp_resp2 = client.get("/api/v1/screentime/export", headers=headers)
    assert exp_resp2.status_code == 200
    assert exp_resp2.json()["total_records"] == 0
