def test_create_and_list_user_plant(client, auth_headers):
    # Get a species ID
    species_res = client.get("/api/v1/species?q=Monstera")
    species_id = species_res.json()[0]["id"]

    # Create plant
    create_payload = {
        "species_id": species_id,
        "nickname": "Fernie Monstera",
        "location": "Living Room",
        "photo_url": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "notifications_enabled": True,
    }
    create_res = client.post(
        "/api/v1/plants", json=create_payload, headers=auth_headers
    )
    assert create_res.status_code == 201
    plant_data = create_res.json()
    assert plant_data["nickname"] == "Fernie Monstera"
    assert plant_data["location"] == "Living Room"
    assert plant_data["watering_interval_days"] == 7
    assert plant_data["next_due_date"] is not None
    plant_id = plant_data["id"]

    # List plants
    list_res = client.get("/api/v1/plants", headers=auth_headers)
    assert list_res.status_code == 200
    plants = list_res.json()
    assert len(plants) >= 1
    assert any(p["id"] == plant_id for p in plants)

    # Filter by location
    loc_res = client.get("/api/v1/plants?location=Living", headers=auth_headers)
    assert loc_res.status_code == 200
    assert len(loc_res.json()) >= 1


def test_get_plant_detail_and_water_plant(client, auth_headers):
    # Create plant
    create_payload = {
        "nickname": "Office Pothos",
        "location": "Office",
        "watering_interval_days": 10,
    }
    create_res = client.post(
        "/api/v1/plants", json=create_payload, headers=auth_headers
    )
    assert create_res.status_code == 201
    plant_id = create_res.json()["id"]

    # Water plant
    water_res = client.post(
        f"/api/v1/plants/{plant_id}/water",
        json={"notes": "Thorough soak in sink"},
        headers=auth_headers,
    )
    assert water_res.status_code == 200
    watered_data = water_res.json()
    assert watered_data["last_watered"] is not None
    assert len(watered_data["watering_logs"]) == 1
    assert watered_data["watering_logs"][0]["notes"] == "Thorough soak in sink"

    # Get plant details
    detail_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["nickname"] == "Office Pothos"
    assert len(detail["watering_logs"]) == 1


def test_update_and_delete_plant(client, auth_headers):
    create_res = client.post(
        "/api/v1/plants",
        json={
            "nickname": "To Update",
            "location": "Balcony",
            "watering_interval_days": 5,
        },
        headers=auth_headers,
    )
    assert create_res.status_code == 201
    plant_id = create_res.json()["id"]

    # Update plant
    update_res = client.put(
        f"/api/v1/plants/{plant_id}",
        json={"nickname": "Updated Balcony Plant", "watering_interval_days": 8},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["nickname"] == "Updated Balcony Plant"
    assert update_res.json()["watering_interval_days"] == 8

    # Delete plant
    del_res = client.delete(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify 404 on get
    get_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers)
    assert get_res.status_code == 404
