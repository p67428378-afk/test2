def test_list_species_catalog(client):
    response = client.get("/api/v1/species")
    assert response.status_code == 200
    species_list = response.json()
    assert isinstance(species_list, list)
    assert len(species_list) >= 5
    names = [s["common_name"] for s in species_list]
    assert "Monstera Deliciosa" in names
    assert "Snake Plant" in names


def test_search_species_by_common_name(client):
    response = client.get("/api/v1/species?q=Monstera")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert "Monstera" in results[0]["common_name"]


def test_search_species_by_scientific_name(client):
    response = client.get("/api/v1/species?q=Sansevieria")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert "Sansevieria" in results[0]["scientific_name"]


def test_get_species_detail_by_id(client):
    # First get list to obtain valid id
    list_res = client.get("/api/v1/species?q=Snake")
    assert list_res.status_code == 200
    species_id = list_res.json()[0]["id"]

    detail_res = client.get(f"/api/v1/species/{species_id}")
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["id"] == species_id
    assert "Snake Plant" in data["common_name"]
    assert "sunlight_requirement" in data
    assert "humidity_requirement" in data
    assert "recommended_watering_days" in data


def test_get_species_not_found(client):
    response = client.get("/api/v1/species/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_create_custom_species(client):
    payload = {
        "common_name": "Calathea Orbifolia",
        "scientific_name": "Goeppertia orbifolia",
        "sunlight_requirement": "Medium Indirect",
        "humidity_requirement": "High (70%+)",
        "recommended_watering_days": 5,
        "description": "A stunning prayer plant relative with large, round silver-striped leaves.",
    }
    response = client.post("/api/v1/species", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["common_name"] == "Calathea Orbifolia"
    assert data["recommended_watering_days"] == 5
    assert "id" in data
