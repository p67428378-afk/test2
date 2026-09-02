def test_get_sites(client):
    response = client.get("/api/v1/sites")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(s["site_code"] == "SITE-ALP-01" for s in data)


def test_create_site_success(client):
    payload = {
        "name": "Beta Trench Dig",
        "site_code": "SITE-BET-02",
        "region": "Levant",
        "historical_period": "Iron Age",
        "latitude": 31.7683,
        "longitude": 35.2137,
        "altitude_meters": 750.0,
        "description": "Secondary excavation trench in the Judean highlands.",
    }
    response = client.post("/api/v1/sites", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["site_code"] == "SITE-BET-02"
    assert data["latitude"] == 31.7683
    assert data["longitude"] == 35.2137


def test_create_site_invalid_gps_bounds(client):
    # Latitude > 90
    bad_lat = {
        "name": "Invalid Lat Site",
        "site_code": "SITE-ERR-01",
        "region": "Polar",
        "historical_period": "Unknown",
        "latitude": 95.5,
        "longitude": 10.0,
    }
    res = client.post("/api/v1/sites", json=bad_lat)
    assert res.status_code in (400, 422)

    # Longitude < -180
    bad_lon = {
        "name": "Invalid Lon Site",
        "site_code": "SITE-ERR-02",
        "region": "Pacific",
        "historical_period": "Unknown",
        "latitude": 10.0,
        "longitude": -195.0,
    }
    res2 = client.post("/api/v1/sites", json=bad_lon)
    assert res2.status_code in (400, 422)


def test_get_site_by_id(client):
    # Fetch existing
    res = client.get("/api/v1/sites")
    site_id = res.json()[0]["id"]

    res_single = client.get(f"/api/v1/sites/{site_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == site_id


def test_update_site(client):
    res = client.get("/api/v1/sites")
    site_id = res.json()[0]["id"]

    res_patch = client.patch(
        f"/api/v1/sites/{site_id}",
        json={"description": "Updated excavation notes."},
    )
    assert res_patch.status_code == 200
    assert res_patch.json()["description"] == "Updated excavation notes."
