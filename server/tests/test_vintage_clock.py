def test_get_server_time(client):
    response = client.get("/api/v1/time")
    assert response.status_code == 200
    data = response.json()
    assert "utc_datetime" in data
    assert data["timezone"] == "UTC"
    assert isinstance(data["timestamp_ms"], int)
    assert data["timestamp_ms"] > 0


def test_alarms_crud(client):
    # 1. Get alarms - should be empty initially
    res = client.get("/api/v1/alarms")
    assert res.status_code == 200
    assert res.json() == []

    # 2. Create an alarm
    alarm_payload = {
        "time": "07:30",
        "label": "Morning Wakeup",
        "enabled": True,
        "repeat_days": ["MON", "TUE", "WED", "THU", "FRI"],
        "sound_type": "mechanical_bell",
        "snooze_duration_minutes": 5,
    }
    res = client.post("/api/v1/alarms", json=alarm_payload)
    assert res.status_code == 201
    created_alarm = res.json()
    assert created_alarm["time"] == "07:30"
    assert created_alarm["label"] == "Morning Wakeup"
    assert created_alarm["enabled"] is True
    assert created_alarm["repeat_days"] == ["MON", "TUE", "WED", "THU", "FRI"]
    assert created_alarm["sound_type"] == "mechanical_bell"
    assert created_alarm["snooze_duration_minutes"] == 5
    alarm_id = created_alarm["id"]

    # 3. Get specific alarm
    res = client.get(f"/api/v1/alarms/{alarm_id}")
    assert res.status_code == 200
    assert res.json()["id"] == alarm_id

    # 4. Update alarm
    update_payload = {
        "time": "08:15",
        "label": "Updated Wakeup",
        "snooze_duration_minutes": 10,
    }
    res = client.put(f"/api/v1/alarms/{alarm_id}", json=update_payload)
    assert res.status_code == 200
    updated_alarm = res.json()
    assert updated_alarm["time"] == "08:15"
    assert updated_alarm["label"] == "Updated Wakeup"
    assert updated_alarm["snooze_duration_minutes"] == 10

    # 5. Delete alarm
    res = client.delete(f"/api/v1/alarms/{alarm_id}")
    assert res.status_code == 200

    # 6. Verify deletion
    res = client.get(f"/api/v1/alarms/{alarm_id}")
    assert res.status_code == 404


def test_alarm_validation(client):
    # Invalid time format (HH:MM required)
    invalid_payload = {
        "time": "25:99",
        "label": "Invalid Time Alarm",
    }
    res = client.post("/api/v1/alarms", json=invalid_payload)
    assert res.status_code == 422


def test_alarm_not_found(client):
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    res = client.get(f"/api/v1/alarms/{fake_uuid}")
    assert res.status_code == 404


def test_user_settings_get_and_update(client):
    # 1. Get default settings
    res = client.get("/api/v1/settings")
    assert res.status_code == 200
    data = res.json()
    assert "id" in data
    assert data["clock_mode"] in ["flip", "analog", "hybrid"]
    assert data["theme_id"] == "antique_brass"
    assert data["time_format"] in ["12h", "24h"]
    assert data["show_second_hand"] is True

    # 2. Update settings
    update_payload = {
        "clock_mode": "analog",
        "theme_id": "retro_neon",
        "time_format": "24h",
        "show_second_hand": False,
        "time_zone": "America/New_York",
    }
    res = client.put("/api/v1/settings", json=update_payload)
    assert res.status_code == 200
    updated_data = res.json()
    assert updated_data["clock_mode"] == "analog"
    assert updated_data["theme_id"] == "retro_neon"
    assert updated_data["time_format"] == "24h"
    assert updated_data["show_second_hand"] is False
    assert updated_data["time_zone"] == "America/New_York"
