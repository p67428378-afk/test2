def test_get_artifacts(client):
    response = client.get("/api/v1/artifacts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(a["artifact_code"] == "ART-2026-001" for a in data)


def test_create_artifact_success(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()[0]["id"]

    payload = {
        "site_id": site_id,
        "artifact_code": "ART-2026-999",
        "material": "Bronze Dagger",
        "context_layer": "Stratum II",
        "depth_meters": 1.4,
        "excavation_date": "2026-05-19",
        "x_offset_meters": 0.5,
        "y_offset_meters": -1.2,
        "z_depth_meters": -1.4,
        "description": "Bronze blade with cast hilt in excellent preservation state.",
    }
    response = client.post("/api/v1/artifacts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["artifact_code"] == "ART-2026-999"
    assert data["material"] == "Bronze Dagger"
    assert data["x_offset_meters"] == 0.5


def test_create_duplicate_barcode_rejected(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()[0]["id"]

    # First artifact with QR
    payload1 = {
        "site_id": site_id,
        "artifact_code": "ART-QR-01",
        "material": "Glass Bead",
        "qr_code_identifier": "UNIQUE-QR-12345",
    }
    res1 = client.post("/api/v1/artifacts", json=payload1)
    assert res1.status_code == 201

    # Second artifact with identical QR code
    payload2 = {
        "site_id": site_id,
        "artifact_code": "ART-QR-02",
        "material": "Gold Ring",
        "qr_code_identifier": "UNIQUE-QR-12345",
    }
    res2 = client.post("/api/v1/artifacts", json=payload2)
    assert res2.status_code in (400, 409, 422)


def test_update_artifact_3d_coordinates(client):
    artifacts_res = client.get("/api/v1/artifacts")
    art_id = artifacts_res.json()[0]["id"]

    patch_payload = {
        "x_offset_meters": 2.15,
        "y_offset_meters": -0.85,
        "z_depth_meters": -2.75,
    }
    res = client.patch(f"/api/v1/artifacts/{art_id}", json=patch_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["x_offset_meters"] == 2.15
    assert data["y_offset_meters"] == -0.85
    assert data["z_depth_meters"] == -2.75
