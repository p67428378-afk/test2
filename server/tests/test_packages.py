"""Unit and integration tests for Packages and Add-on endpoints."""


def test_list_packages(client):
    response = client.get("/api/v1/packages")
    assert response.status_code == 200
    pkgs = response.json()
    assert len(pkgs) >= 4
    wedding = next((p for p in pkgs if p["name"] == "Wedding Package"), None)
    assert wedding is not None
    assert wedding["price"] == 1200.00
    assert wedding["duration_minutes"] == 360


def test_list_addons(client):
    response = client.get("/api/v1/packages/addons")
    assert response.status_code == 200
    addons = response.json()
    assert len(addons) >= 3
    drone = next((a for a in addons if "Drone" in a["name"]), None)
    assert drone is not None
    assert drone["price"] == 250.00


def test_create_and_update_package(client):
    create_payload = {
        "name": "Maternity & Newborn Package",
        "description": "Gentle in-studio maternity and newborn photo session.",
        "price": 450.00,
        "duration_minutes": 90,
        "deliverables_summary": "1.5 hrs coverage • 20 edited photos",
    }
    response = client.post("/api/v1/packages", json=create_payload)
    assert response.status_code == 201
    pkg = response.json()
    pkg_id = pkg["id"]
    assert pkg["name"] == "Maternity & Newborn Package"
    assert pkg["price"] == 450.00

    # Update
    update_payload = {"price": 490.00}
    upd_res = client.put(f"/api/v1/packages/{pkg_id}", json=update_payload)
    assert upd_res.status_code == 200
    assert upd_res.json()["price"] == 490.00

    # Delete
    del_res = client.delete(f"/api/v1/packages/{pkg_id}")
    assert del_res.status_code == 200
