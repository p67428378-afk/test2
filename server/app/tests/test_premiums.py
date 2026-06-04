def test_calculate_premium(client):
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"base_rate": 500, "ncb_percentage": 20, "vehicle_multiplier": 1.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_premium"] == 400.0

def test_calculate_premium_max_ncb(client):
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"base_rate": 500, "ncb_percentage": 60, "vehicle_multiplier": 1.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_premium"] == 250.0 # 50% cap on NCB

def test_calculate_premium_max_multiplier(client):
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"base_rate": 500, "ncb_percentage": 20, "vehicle_multiplier": 2.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_premium"] == 640.0 # 1.6x cap on multiplier

def test_calculate_premium_min_multiplier(client):
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"base_rate": 500, "ncb_percentage": 20, "vehicle_multiplier": 0.5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_premium"] == 320.0 # 0.8x cap on multiplier
