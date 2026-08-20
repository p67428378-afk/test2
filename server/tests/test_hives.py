def test_list_hives(client):
    response = client.get("/api/v1/hives")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  # Seeded hives


def test_create_and_get_hive(client):
    # First get apiaries
    apiaries_resp = client.get("/api/v1/apiaries")
    assert apiaries_resp.status_code == 200
    apiaries = apiaries_resp.json()
    assert len(apiaries) > 0
    apiary_id = apiaries[0]["id"]

    # Create hive
    payload = {
        "apiary_id": apiary_id,
        "hive_number": "HIVE-TEST-99",
        "queen_breed": "Caucasian",
        "status": "active",
        "estimated_population": 42000,
    }
    create_resp = client.post("/api/v1/hives", json=payload)
    assert create_resp.status_code == 201
    hive_data = create_resp.json()
    assert hive_data["hive_number"] == "HIVE-TEST-99"
    assert hive_data["estimated_population"] == 42000

    hive_id = hive_data["id"]

    # Get hive
    get_resp = client.get(f"/api/v1/hives/{hive_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["hive_number"] == "HIVE-TEST-99"

    # Patch hive
    patch_resp = client.patch(
        f"/api/v1/hives/{hive_id}", json={"status": "quarantined"}
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "quarantined"


def test_get_nonexistent_hive(client):
    response = client.get("/api/v1/hives/nonexistent-id-12345")
    assert response.status_code == 404
