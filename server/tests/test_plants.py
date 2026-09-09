from datetime import datetime, timezone, timedelta


def parse_dt(dt_str: str) -> datetime:
    if not dt_str:
        return datetime.now(timezone.utc)
    s = dt_str.replace("Z", "+00:00")
    dt = datetime.fromisoformat(s)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def test_list_user_plants(client, auth_headers):
    response = client.get("/api/v1/plants", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    plant_names = [p["nickname"] for p in data]
    assert "Fernie Monstera" in plant_names


def test_list_user_plants_location_filter(client, auth_headers):
    response = client.get(
        "/api/v1/plants", params={"location": "Sunroom"}, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["location"] == "Sunroom"


def test_create_user_plant_success(client, auth_headers):
    species_res = client.get("/api/v1/species", params={"q": "Snake Plant"})
    species_id = species_res.json()[0]["id"]

    payload = {
        "nickname": "Emerald Blade",
        "species_id": species_id,
        "location": "Living Room",
        "photo_url": "https://images.unsplash.com/photo-example",
        "watering_interval_days": 10,
        "notifications_enabled": True,
    }
    response = client.post("/api/v1/plants", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["nickname"] == "Emerald Blade"
    assert data["location"] == "Living Room"
    assert data["watering_interval_days"] == 10
    assert data["next_water_due"] is not None
    assert "id" in data


def test_create_duplicate_plant_nicknames(client, auth_headers):
    # AC 2 edge case: Duplicate nicknames within single user collection are supported by internal UUIDs
    payload1 = {
        "nickname": "Fernie",
        "location": "Living Room",
        "watering_interval_days": 7,
    }
    payload2 = {
        "nickname": "Fernie",
        "location": "Bedroom",
        "watering_interval_days": 14,
    }

    res1 = client.post("/api/v1/plants", json=payload1, headers=auth_headers)
    res2 = client.post("/api/v1/plants", json=payload2, headers=auth_headers)

    assert res1.status_code == 201
    assert res2.status_code == 201
    data1 = res1.json()
    data2 = res2.json()
    assert data1["nickname"] == "Fernie"
    assert data2["nickname"] == "Fernie"
    assert data1["id"] != data2["id"]
    assert data1["location"] == "Living Room"
    assert data2["location"] == "Bedroom"


def test_get_user_plant_by_id(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == plant_id
    assert "nickname" in data


def test_update_user_plant(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    update_payload = {
        "location": "Master Bedroom Balcony",
        "watering_interval_days": 12,
        "notifications_enabled": False,
    }
    res = client.put(
        f"/api/v1/plants/{plant_id}", json=update_payload, headers=auth_headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["location"] == "Master Bedroom Balcony"
    assert data["watering_interval_days"] == 12
    assert data["notifications_enabled"] is False


def test_water_user_plant(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant = list_res.json()[0]
    plant_id = plant["id"]
    interval = plant["watering_interval_days"] or 7

    now = datetime.now(timezone.utc)
    water_payload = {
        "watered_at": now.isoformat(),
        "notes": "Watered thoroughly until drainage appeared.",
    }
    res = client.post(
        f"/api/v1/plants/{plant_id}/water", json=water_payload, headers=auth_headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["last_watered_at"] is not None

    # Verify next due date is now + interval days
    next_due = parse_dt(data["next_water_due"])
    expected_due = now + timedelta(days=interval)
    diff = abs((next_due - expected_due).total_seconds())
    assert diff < 60


def test_fertilize_user_plant(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    now = datetime.now(timezone.utc)
    res = client.post(
        f"/api/v1/plants/{plant_id}/fertilize",
        json={
            "fertilized_at": now.isoformat(),
            "notes": "Half-strength liquid fertilizer.",
        },
        headers=auth_headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["last_fertilized_at"] is not None


def test_snooze_plant_notifications(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    res = client.post(
        f"/api/v1/plants/{plant_id}/snooze",
        json={"snooze_hours": 48},
        headers=auth_headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["snoozed_until"] is not None


def test_delete_user_plant(client, auth_headers):
    create_res = client.post(
        "/api/v1/plants",
        json={
            "nickname": "Temporary Plant",
            "location": "Balcony",
            "watering_interval_days": 5,
        },
        headers=auth_headers,
    )
    plant_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert get_res.status_code == 404
