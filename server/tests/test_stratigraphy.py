def test_get_trench_stratigraphy_3d(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()[0]["id"]

    response = client.get(f"/api/v1/sites/{site_id}/stratigraphy")
    assert response.status_code == 200
    data = response.json()
    assert data["site_id"] == site_id
    assert "bounds" in data
    assert "layers" in data
    assert "artifacts" in data
    assert len(data["layers"]) >= 3
    assert len(data["artifacts"]) >= 1

    # Bounds check
    assert data["bounds"]["min_depth"] <= 0.0
    assert data["bounds"]["max_depth"] > 0.0

    # Check artifact spatial node properties
    node = data["artifacts"][0]
    assert "x_offset_meters" in node
    assert "y_offset_meters" in node
    assert "z_depth_meters" in node
    assert isinstance(node["interpolated_depth"], bool)


def test_add_stratigraphic_layer_success(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()[0]["id"]

    layer_payload = {
        "layer_code": "Stratum IV-Deep",
        "historical_period": "Early Bronze / Chalcolithic",
        "depth_top_meters": 3.5,
        "depth_bottom_meters": 5.2,
        "color_hex": "#5C2E0B",
    }
    response = client.post(f"/api/v1/sites/{site_id}/stratigraphy", json=layer_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["layer_code"] == "Stratum IV-Deep"
    assert data["depth_top_meters"] == 3.5
    assert data["depth_bottom_meters"] == 5.2


def test_add_stratigraphic_layer_invalid_depths(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()[0]["id"]

    # Top depth >= Bottom depth
    bad_layer = {
        "layer_code": "Bad Stratum",
        "historical_period": "Test Period",
        "depth_top_meters": 4.0,
        "depth_bottom_meters": 2.0,
    }
    res = client.post(f"/api/v1/sites/{site_id}/stratigraphy", json=bad_layer)
    assert res.status_code in (400, 422)
