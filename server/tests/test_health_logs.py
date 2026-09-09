def test_create_and_list_health_logs(client, auth_headers):
    # 1. Get plant ID
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    # 2. Create health log with repotting
    payload = {
        "plant_id": plant_id,
        "rating": "Good",
        "notes": "Repotted into 10-inch terracotta container with chunky aroid mix.",
        "repotted_flag": True,
        "photo_url": "https://images.unsplash.com/photo-health-1",
    }
    response = client.post("/api/v1/health-logs", json=payload, headers=auth_headers)
    assert response.status_code == 201
    log_data = response.json()
    assert log_data["rating"] == "Good"
    assert log_data["repotted_flag"] is True
    assert log_data["plant_id"] == plant_id

    # 3. Verify plant status updated to Repotted
    plant_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert plant_res.json()["status"] == "Repotted"

    # 4. List health logs for plant
    logs_res = client.get(
        "/api/v1/health-logs", params={"plant_id": plant_id}, headers=auth_headers
    )
    assert logs_res.status_code == 200
    logs_list = logs_res.json()
    assert len(logs_list) >= 1
    assert logs_list[0]["notes"] == payload["notes"]


def test_create_health_log_invalid_rating(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    payload = {
        "plant_id": plant_id,
        "rating": "Superb",  # Invalid rating
        "notes": "Invalid rating test",
    }
    response = client.post("/api/v1/health-logs", json=payload, headers=auth_headers)
    assert response.status_code == 400
    assert "Invalid health rating" in response.json()["detail"]


def test_health_log_lifecycle(client, auth_headers):
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    plant_id = list_res.json()[0]["id"]

    # Create log with rating Poor
    payload = {
        "plant_id": plant_id,
        "rating": "Poor",
        "notes": "Yellowing lower leaves noticed.",
    }
    res = client.post("/api/v1/health-logs", json=payload, headers=auth_headers)
    assert res.status_code == 201
    log_id = res.json()["id"]

    # Verify plant status became Sick
    plant_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert plant_res.json()["status"] == "Sick"

    # Fetch log by ID
    get_res = client.get(f"/api/v1/health-logs/{log_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == log_id

    # Delete log
    del_res = client.delete(f"/api/v1/health-logs/{log_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Fetch after delete
    get_del = client.get(f"/api/v1/health-logs/{log_id}", headers=auth_headers)
    assert get_del.status_code == 404
