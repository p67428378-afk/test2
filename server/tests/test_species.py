def test_list_species(client):
    response = client.get("/api/v1/species")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    common_names = [s["common_name"] for s in data]
    assert "Monstera Deliciosa" in common_names
    assert "Snake Plant" in common_names


def test_search_species_by_common_name(client):
    response = client.get("/api/v1/species", params={"q": "Monstera"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["common_name"] == "Monstera Deliciosa"
    assert data[0]["recommended_watering_days"] == 7


def test_search_species_by_scientific_name(client):
    response = client.get("/api/v1/species", params={"q": "Ficus lyrata"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["common_name"] == "Fiddle-Leaf Fig"


def test_filter_species_by_sunlight(client):
    response = client.get("/api/v1/species", params={"sunlight": "Direct"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for s in data:
        assert (
            "Direct" in s["sunlight_requirement"]
            and "Indirect" not in s["sunlight_requirement"]
        )


def test_get_species_by_id_success(client):
    list_res = client.get("/api/v1/species")
    species_id = list_res.json()[0]["id"]

    res = client.get(f"/api/v1/species/{species_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == species_id
    assert "common_name" in data


def test_get_species_by_id_not_found(client):
    res = client.get("/api/v1/species/non-existent-uuid-999")
    assert res.status_code == 404


def test_create_custom_species(client, auth_headers):
    payload = {
        "common_name": "Calathea Orbifolia",
        "scientific_name": "Goeppertia orbifolia",
        "sunlight_requirement": "Medium Indirect Light",
        "humidity_requirement": "High (60-80%)",
        "recommended_watering_days": 6,
        "description": "Stunning oversized striped foliage that requires high humidity and filtered water.",
    }
    response = client.post("/api/v1/species", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["common_name"] == "Calathea Orbifolia"
    assert data["is_custom"] is True
    assert data["recommended_watering_days"] == 6


def test_create_custom_species_validation_error(client, auth_headers):
    payload = {
        "common_name": "   ",
        "scientific_name": "Invalid species",
    }
    response = client.post("/api/v1/species", json=payload, headers=auth_headers)
    assert response.status_code == 400
