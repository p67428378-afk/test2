import pytest


def test_create_and_get_site(client):
    site_payload = {
        "name": "Tell Yarmouth South",
        "site_code": "SITE-YARM-01",
        "region": "Levant",
        "historical_period": "Early Bronze Age III",
        "latitude": 31.7044,
        "longitude": 34.9752,
        "altitude_meters": 340.5,
        "description": "Fortified urban tell with massive cyclopean stone walls and glacis."
    }
    response = client.post("/api/v1/sites", json=site_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == site_payload["name"]
    assert data["site_code"] == site_payload["site_code"]
    assert "id" in data
    site_id = data["id"]

    # Get Site by ID
    get_res = client.get(f"/api/v1/sites/{site_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == site_id


def test_site_gps_coordinate_validation(client):
    # Latitude out of bounds
    invalid_lat = {
        "name": "Invalid Lat Site",
        "site_code": "SITE-INV-LAT",
        "region": "Arctic",
        "historical_period": "Unknown",
        "latitude": 95.0,  # Invalid: > 90
        "longitude": 0.0,
    }
    res_lat = client.post("/api/v1/sites", json=invalid_lat)
    assert res_lat.status_code == 422

    # Longitude out of bounds
    invalid_lon = {
        "name": "Invalid Lon Site",
        "site_code": "SITE-INV-LON",
        "region": "Pacific",
        "historical_period": "Unknown",
        "latitude": 0.0,
        "longitude": -195.0,  # Invalid: < -180
    }
    res_lon = client.post("/api/v1/sites", json=invalid_lon)
    assert res_lon.status_code == 422


def test_duplicate_site_conflict(client):
    payload = {
        "name": "Site Unique Test",
        "site_code": "SITE-UNIQ-01",
        "region": "Near East",
        "historical_period": "Iron Age",
        "latitude": 32.0,
        "longitude": 35.0,
    }
    res1 = client.post("/api/v1/sites", json=payload)
    assert res1.status_code == 201

    # Attempt duplicate
    res2 = client.post("/api/v1/sites", json=payload)
    assert res2.status_code == 409


def test_list_and_filter_sites(client):
    res = client.get("/api/v1/sites?skip=0&limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert data["total"] >= 1


def test_update_and_delete_site(client):
    site_payload = {
        "name": "Site to Delete",
        "site_code": "SITE-DEL-01",
        "region": "Anatolia",
        "historical_period": "Neolithic",
        "latitude": 37.6667,
        "longitude": 32.8167,
    }
    res = client.post("/api/v1/sites", json=site_payload)
    assert res.status_code == 201
    site_id = res.json()["id"]

    # Patch update
    update_res = client.patch(f"/api/v1/sites/{site_id}", json={"description": "Updated neolithic mound notes."})
    assert update_res.status_code == 200
    assert update_res.json()["description"] == "Updated neolithic mound notes."

    # Delete
    del_res = client.delete(f"/api/v1/sites/{site_id}")
    assert del_res.status_code == 204

    # Verify 404
    get_res = client.get(f"/api/v1/sites/{site_id}")
    assert get_res.status_code == 404
