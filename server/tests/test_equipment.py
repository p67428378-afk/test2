def test_get_equipment_list(client):
    response = client.get("/api/v1/equipment")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Since we seed data on startup, there should be seeded equipment
    assert len(data) > 0
    assert data[0]["serial_number"] in ["CTD-9921", "ADCP-4412", "DSC-1029"]


def test_update_equipment(client):
    # Get seeded equipment
    get_resp = client.get("/api/v1/equipment")
    equipment_id = get_resp.json()[0]["id"]

    # Update status and location
    update_payload = {"status": "In Repair", "location": "Dry Dock"}
    update_resp = client.put(f"/api/v1/equipment/{equipment_id}", json=update_payload)
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["status"] == "In Repair"
    assert data["location"] == "Dry Dock"


def test_update_equipment_not_found(client):
    update_payload = {"status": "In Repair"}
    response = client.put(
        "/api/v1/equipment/00000000-0000-0000-0000-000000000000", json=update_payload
    )
    assert response.status_code == 404
