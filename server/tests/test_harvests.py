from datetime import date


def test_create_and_list_harvest(client):
    hives_resp = client.get("/api/v1/hives")
    assert hives_resp.status_code == 200
    hives = hives_resp.json()
    hive_id = hives[0]["id"]

    payload = {
        "hive_id": hive_id,
        "harvest_date": str(date.today()),
        "quantity_kg": 30.0,
        "honey_type": "Clover Honey",
        "moisture_content_percent": 16.8,
    }

    create_resp = client.post("/api/v1/harvests", json=payload)
    assert create_resp.status_code == 201
    data = create_resp.json()
    assert data["quantity_kg"] == 30.0
    assert data["honey_type"] == "Clover Honey"

    list_resp = client.get(f"/api/v1/harvests?hive_id={hive_id}")
    assert list_resp.status_code == 200
    harvests = list_resp.json()
    assert any(h["quantity_kg"] == 30.0 for h in harvests)
