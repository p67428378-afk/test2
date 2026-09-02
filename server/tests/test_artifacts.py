import pytest


def test_create_and_get_artifact(client):
    # First create a site
    site_res = client.post("/api/v1/sites", json={
        "name": "Artifact Test Trench",
        "site_code": "SITE-ART-TRENCH",
        "region": "Aegean",
        "historical_period": "Mycenaean",
        "latitude": 37.7308,
        "longitude": 22.7561,
    })
    site_id = site_res.json()["id"]

    artifact_payload = {
        "site_id": site_id,
        "artifact_code": "ART-MYC-101",
        "material": "Bronze",
        "context_layer": "Stratum II",
        "depth_meters": 1.85,
        "excavation_date": "2026-03-22",
        "description": "Bronze dagger with gold inlaid spiral patterns."
    }
    res = client.post("/api/v1/artifacts", json=artifact_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["artifact_code"] == "ART-MYC-101"
    assert data["material"] == "Bronze"
    artifact_id = data["id"]

    # Get Artifact Detail
    get_res = client.get(f"/api/v1/artifacts/{artifact_id}")
    assert get_res.status_code == 200
    detail = get_res.json()
    assert detail["id"] == artifact_id
    assert detail["site"]["name"] == "Artifact Test Trench"


def test_create_artifact_invalid_site(client):
    res = client.post("/api/v1/artifacts", json={
        "site_id": "00000000-0000-0000-0000-000000000000",
        "artifact_code": "ART-ERR-001",
        "material": "Ceramic",
        "context_layer": "Layer 1",
        "depth_meters": 0.5,
        "excavation_date": "2026-01-01",
    })
    assert res.status_code == 404


def test_duplicate_artifact_code_conflict(client):
    # Get any existing site
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()["items"][0]["id"]

    payload = {
        "site_id": site_id,
        "artifact_code": "ART-DUP-CODE-01",
        "material": "Lithic",
        "context_layer": "Layer 4",
        "depth_meters": 3.2,
        "excavation_date": "2026-02-10",
    }
    res1 = client.post("/api/v1/artifacts", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/artifacts", json=payload)
    assert res2.status_code == 409


def test_list_and_filter_artifacts(client):
    res = client.get("/api/v1/artifacts?skip=0&limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) >= 1


def test_update_and_delete_artifact(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()["items"][0]["id"]

    res = client.post("/api/v1/artifacts", json={
        "site_id": site_id,
        "artifact_code": "ART-TO-DELETE-01",
        "material": "Bone",
        "context_layer": "Layer 1",
        "depth_meters": 0.4,
        "excavation_date": "2026-03-01",
    })
    art_id = res.json()["id"]

    # Update
    patch_res = client.patch(f"/api/v1/artifacts/{art_id}", json={"description": "Polished bone awl."})
    assert patch_res.status_code == 200
    assert patch_res.json()["description"] == "Polished bone awl."

    # Delete
    del_res = client.delete(f"/api/v1/artifacts/{art_id}")
    assert del_res.status_code == 204

    # 404 check
    assert client.get(f"/api/v1/artifacts/{art_id}").status_code == 404
