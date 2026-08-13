def test_get_equipment_catalog(client):
    response = client.get("/api/v1/equipment")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_equipment_by_category(client):
    response = client.get("/api/v1/equipment?category=CAMERAS")
    assert response.status_code == 200
    data = response.json()
    for item in data:
        assert item["category"] == "CAMERAS"


def test_create_equipment_as_admin(client, admin_token_headers):
    payload = {
        "name": "RED Komodo 6K Camera",
        "category": "CAMERAS",
        "daily_rate": 150.0,
        "deposit_amount": 500.0,
        "specifications": {"resolution": "6K", "mount": "RF"},
    }
    response = client.post(
        "/api/v1/equipment", json=payload, headers=admin_token_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "RED Komodo 6K Camera"
    assert data["daily_rate"] == 150.0


def test_create_equipment_as_renter_forbidden(client, user_token_headers):
    payload = {
        "name": "Forbidden Drone",
        "category": "DRONES",
        "daily_rate": 80.0,
        "deposit_amount": 200.0,
    }
    response = client.post(
        "/api/v1/equipment", json=payload, headers=user_token_headers
    )
    assert response.status_code == 403
