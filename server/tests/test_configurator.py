def test_calculate_dynamic_price_valid(client):
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    frame_res = client.get("/api/v1/frame-options")
    frame_id = frame_res.json()[0]["id"]

    payload = {
        "painting_id": painting_id,
        "custom_width_inches": 36,
        "custom_height_inches": 48,
        "frame_option_id": frame_id,
    }

    res = client.post("/api/v1/configurator/price", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["painting_id"] == painting_id
    assert float(data["calculated_unit_price"]) > 0
    assert data["is_valid"] is True


def test_calculate_dynamic_price_invalid_dimensions(client):
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    # Width less than 12
    payload = {
        "painting_id": painting_id,
        "custom_width_inches": 10,
        "custom_height_inches": 48,
    }

    res = client.post("/api/v1/configurator/price", json=payload)
    assert res.status_code == 400
    assert "between 12" in res.json()["detail"]


def test_calculate_dynamic_price_exceeds_max(client):
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    payload = {
        "painting_id": painting_id,
        "custom_width_inches": 150,
        "custom_height_inches": 48,
    }

    res = client.post("/api/v1/configurator/price", json=payload)
    assert res.status_code == 400
