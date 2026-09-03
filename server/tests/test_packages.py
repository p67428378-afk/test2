def test_list_packages_and_addons(client):
    res_pkg = client.get("/api/v1/packages")
    assert res_pkg.status_code == 200
    pkgs = res_pkg.json()
    assert len(pkgs) >= 4
    pkg_names = [p["name"] for p in pkgs]
    assert "Portrait Package" in pkg_names
    assert "Wedding Package" in pkg_names

    res_addons = client.get("/api/v1/packages/addons")
    assert res_addons.status_code == 200
    addons = res_addons.json()
    assert len(addons) >= 3
    addon_ids = [a["id"] for a in addons]
    assert "addon-drone" in addon_ids


def test_package_crud_admin(client, admin_headers, customer_headers):
    # Customer cannot create package (403)
    new_pkg = {
        "name": "Maternity Deluxe Package",
        "description": "Studio and scenic outdoor maternity session.",
        "duration_minutes": 120,
        "price": 550.00,
        "deliverables_summary": "2 hrs coverage • 30 edited photos • Online gallery",
    }
    res_cust = client.post("/api/v1/packages", json=new_pkg, headers=customer_headers)
    assert res_cust.status_code == 403

    # Admin creates package (201)
    res_admin = client.post("/api/v1/packages", json=new_pkg, headers=admin_headers)
    assert res_admin.status_code == 201
    created = res_admin.json()
    pkg_id = created["id"]
    assert created["name"] == "Maternity Deluxe Package"
    assert created["price"] == 550.00

    # Get package
    res_get = client.get(f"/api/v1/packages/{pkg_id}")
    assert res_get.status_code == 200
    assert res_get.json()["name"] == "Maternity Deluxe Package"

    # Admin updates package
    res_update = client.put(
        f"/api/v1/packages/{pkg_id}",
        json={"price": 600.00, "description": "Updated description"},
        headers=admin_headers,
    )
    assert res_update.status_code == 200
    assert res_update.json()["price"] == 600.00

    # Admin deactivates package
    res_del = client.delete(f"/api/v1/packages/{pkg_id}", headers=admin_headers)
    assert res_del.status_code == 204
