def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "version" in response.json()


def test_list_all_chocolates(client):
    response = client.get("/api/v1/chocolates")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(items) >= 5
    # Check essential fields
    first = items[0]
    assert "id" in first
    assert "title" in first
    assert "cocoa_percentage" in first
    assert "origin_region" in first
    assert "price" in first
    assert "is_heat_sensitive" in first


def test_filter_chocolates_by_cocoa(client):
    response = client.get("/api/v1/chocolates?min_cocoa=80")
    assert response.status_code == 200
    items = response.json()
    for item in items:
        assert item["cocoa_percentage"] >= 80

    response_max = client.get("/api/v1/chocolates?max_cocoa=70")
    assert response_max.status_code == 200
    items_max = response_max.json()
    for item in items_max:
        assert item["cocoa_percentage"] <= 70


def test_filter_chocolates_by_origin(client):
    response = client.get("/api/v1/chocolates?origin=Madagascar")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    for item in items:
        assert "Madagascar" in item["origin_region"]


def test_filter_chocolates_by_flavor(client):
    response = client.get("/api/v1/chocolates?flavor=Floral")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    for item in items:
        assert "Floral" in item["flavor_notes"]


def test_filter_chocolates_by_dietary(client):
    response = client.get("/api/v1/chocolates?dietary=Vegan")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    for item in items:
        assert "Vegan" in item["dietary_flags"]


def test_filter_no_match(client):
    response = client.get("/api/v1/chocolates?origin=NonExistentPlace999")
    assert response.status_code == 200
    items = response.json()
    assert items == []


def test_get_chocolate_detail(client):
    list_resp = client.get("/api/v1/chocolates")
    choc_id = list_resp.json()[0]["id"]

    response = client.get(f"/api/v1/chocolates/{choc_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == choc_id
    assert "description" in data
    assert "stock_quantity" in data


def test_get_chocolate_detail_not_found(client):
    response = client.get("/api/v1/chocolates/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert "detail" in response.json()


def test_create_chocolate(client):
    payload = {
        "title": "Costa Rican Single Estate 75%",
        "description": "Artisanal dark chocolate bar from Costa Rica highlands.",
        "cocoa_percentage": 75,
        "origin_region": "Costa Rica",
        "flavor_notes": "Woody, Tobacco, Vanilla",
        "dietary_flags": "Vegan, Organic",
        "price": 13.50,
        "stock_quantity": 12,
        "is_heat_sensitive": True,
    }
    response = client.post("/api/v1/chocolates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["price"] == 13.50
