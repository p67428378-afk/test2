import uuid
from fastapi.testclient import TestClient


def test_list_modules_all(client: TestClient):
    response = client.get("/api/v1/modules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    titles = [m["title"] for m in data]
    assert "Brachial Plexus Anatomy & Innervation" in titles
    assert "Cardiac Cycle Mechanics & Wiggers Diagram" in titles


def test_list_modules_filtered_by_subject(client: TestClient):
    # Filter by anatomy
    resp_anatomy = client.get("/api/v1/modules?subject=anatomy")
    assert resp_anatomy.status_code == 200
    anat_data = resp_anatomy.json()
    assert len(anat_data) >= 1
    assert all(m["subject"] == "anatomy" for m in anat_data)

    # Filter by physiology
    resp_physio = client.get("/api/v1/modules?subject=physiology")
    assert resp_physio.status_code == 200
    phys_data = resp_physio.json()
    assert len(phys_data) >= 1
    assert all(m["subject"] == "physiology" for m in phys_data)

    # Filter by biochemistry
    resp_biochem = client.get("/api/v1/modules?subject=biochemistry")
    assert resp_biochem.status_code == 200
    bio_data = resp_biochem.json()
    assert len(bio_data) >= 1
    assert all(m["subject"] == "biochemistry" for m in bio_data)


def test_get_module_by_id_success(client: TestClient):
    # Fetch all modules to get a valid ID
    list_resp = client.get("/api/v1/modules")
    modules = list_resp.json()
    anatomy_mod = next(m for m in modules if m["subject"] == "anatomy")

    detail_resp = client.get(f"/api/v1/modules/{anatomy_mod['id']}")
    assert detail_resp.status_code == 200
    mod_data = detail_resp.json()
    assert mod_data["id"] == anatomy_mod["id"]
    assert mod_data["title"] == anatomy_mod["title"]
    assert "image_layers" in mod_data
    assert len(mod_data["image_layers"]) >= 4

    # Verify layer structure
    first_layer = mod_data["image_layers"][0]
    assert "layer_name" in first_layer
    assert "image_url" in first_layer


def test_get_module_not_found(client: TestClient):
    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/modules/{random_uuid}")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_module_invalid_uuid(client: TestClient):
    response = client.get("/api/v1/modules/not-a-valid-uuid")
    assert response.status_code == 422


def test_create_module(client: TestClient):
    payload = {
        "title": "Histology of the Renal Glomerulus",
        "subject": "anatomy",
        "description": "Microscopic histology of podocytes, basement membrane, and Bowman's capsule.",
        "thumbnail_url": "https://example.com/renal_thumb.jpg",
        "animation_url": "https://example.com/renal_anim.mp4",
    }
    response = client.post("/api/v1/modules", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == payload["title"]
    assert created["subject"] == "anatomy"
    assert "id" in created
