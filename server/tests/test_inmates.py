def test_list_seeded_inmates(client):
    resp = client.get("/api/v1/inmates")
    assert resp.status_code == 200
    inmates = resp.json()
    assert len(inmates) >= 3
    numbers = [i["inmate_number"] for i in inmates]
    assert "INV-404" in numbers
    assert "INV-501" in numbers


def test_create_inmate(client):
    resp = client.post(
        "/api/v1/inmates",
        json={
            "inmate_number": "INV-777",
            "full_name": "Thomas Shelby",
            "cell_location": "Block D - Cell 401",
            "security_level": "MAXIMUM",
            "weekly_visit_limit": 2,
            "status": "ACTIVE",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["inmate_number"] == "INV-777"
    assert data["full_name"] == "Thomas Shelby"


def test_duplicate_inmate_number_rejected(client):
    client.post(
        "/api/v1/inmates",
        json={
            "inmate_number": "INV-DUP-99",
            "full_name": "Original Inmate",
            "cell_location": "Block D - Cell 401",
        },
    )
    resp = client.post(
        "/api/v1/inmates",
        json={
            "inmate_number": "INV-DUP-99",
            "full_name": "Duplicate Inmate",
            "cell_location": "Block D - Cell 402",
        },
    )
    assert resp.status_code == 400


def test_get_inmate_by_id(client):
    inmates = client.get("/api/v1/inmates").json()
    inmate_id = inmates[0]["id"]

    resp = client.get(f"/api/v1/inmates/{inmate_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == inmate_id
