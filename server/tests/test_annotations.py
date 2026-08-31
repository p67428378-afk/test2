import uuid
from fastapi.testclient import TestClient


def test_get_module_annotations_success(client: TestClient):
    # Retrieve Anatomy module
    modules_resp = client.get("/api/v1/modules?subject=anatomy")
    anatomy_mod = modules_resp.json()[0]

    ann_resp = client.get(f"/api/v1/annotations/module/{anatomy_mod['id']}")
    assert ann_resp.status_code == 200
    data = ann_resp.json()

    assert data["module_id"] == anatomy_mod["id"]
    assert "layers" in data
    assert len(data["layers"]) >= 4
    assert "hotspots" in data
    assert len(data["hotspots"]) >= 5

    # Check hotspot properties
    radial_nerve_hotspot = next(
        (h for h in data["hotspots"] if "Radial" in h["title"]), None
    )
    assert radial_nerve_hotspot is not None
    assert radial_nerve_hotspot["x_percent"] > 0
    assert radial_nerve_hotspot["y_percent"] > 0
    assert "wrist drop" in radial_nerve_hotspot["clinical_significance"].lower()


def test_get_module_annotations_not_found(client: TestClient):
    random_uuid = str(uuid.uuid4())
    resp = client.get(f"/api/v1/annotations/module/{random_uuid}")
    assert resp.status_code == 404


def test_get_module_annotations_invalid_uuid(client: TestClient):
    resp = client.get("/api/v1/annotations/module/invalid-id")
    assert resp.status_code == 422


def test_create_layer_and_hotspot(client: TestClient):
    # First create a new module
    mod_resp = client.post(
        "/api/v1/modules",
        json={
            "title": "Coronary Circulation & Angiography",
            "subject": "anatomy",
            "description": "Left anterior descending and circumflex artery branching patterns.",
        },
    )
    mod_id = mod_resp.json()["id"]

    # Create a layer
    layer_resp = client.post(
        "/api/v1/annotations/layers",
        json={
            "module_id": mod_id,
            "layer_name": "Arterial Tree",
            "layer_order": 1,
            "image_url": "https://example.com/coronary_arteries.png",
        },
    )
    assert layer_resp.status_code == 201
    layer_data = layer_resp.json()
    layer_id = layer_data["id"]
    assert layer_data["layer_name"] == "Arterial Tree"

    # Create a hotspot
    hotspot_resp = client.post(
        "/api/v1/annotations/hotspots",
        json={
            "layer_id": layer_id,
            "x_percent": 45.5,
            "y_percent": 62.3,
            "title": "Left Anterior Descending (LAD) Artery",
            "clinical_notes": "Supplies anterior 2/3 of interventricular septum.",
            "clinical_significance": "Most commonly occluded artery in myocardial infarction ('Widowmaker').",
        },
    )
    assert hotspot_resp.status_code == 201
    hotspot_data = hotspot_resp.json()
    assert hotspot_data["title"] == "Left Anterior Descending (LAD) Artery"
    assert hotspot_data["x_percent"] == 45.5
