from datetime import date


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"


def test_product_registration_and_get(client):
    today_str = date.today().isoformat()
    payload = {
        "product_name": "MacBook Pro 16",
        "serial_number": "MBP-2026-9901",
        "brand": "Apple",
        "category": "Laptops",
        "purchase_date": today_str,
        "duration_months": 24,
        "vendor_name": "Apple Store",
    }
    # Register product
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 201
    p_data = response.json()
    assert p_data["product_name"] == "MacBook Pro 16"
    assert p_data["serial_number"] == "MBP-2026-9901"
    assert p_data["warranty"]["duration_months"] == 24
    assert p_data["warranty"]["status"] == "ACTIVE"
    product_id = p_data["id"]

    # Get details
    get_res = client.get(f"/api/v1/products/{product_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == product_id


def test_product_search_and_filter(client):
    today_str = date.today().isoformat()
    client.post(
        "/api/v1/products",
        json={
            "product_name": "Dell XPS 15",
            "serial_number": "DELL-XPS-8877",
            "brand": "Dell",
            "category": "Laptops",
            "purchase_date": today_str,
            "duration_months": 12,
            "vendor_name": "Dell Direct",
        },
    )

    # Search by brand
    res = client.get("/api/v1/products?brand=Dell")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 1
    assert any(i["brand"] == "Dell" for i in items)

    # Search query
    res2 = client.get("/api/v1/products?search=XPS")
    assert res2.status_code == 200
    assert len(res2.json()) >= 1


def test_product_stats(client):
    res = client.get("/api/v1/products/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "total_products" in stats
    assert "active" in stats
    assert "expiring_soon" in stats
    assert "expired" in stats


def test_product_update_and_delete(client):
    today_str = date.today().isoformat()
    reg = client.post(
        "/api/v1/products",
        json={
            "product_name": "Temp Monitor",
            "serial_number": "TEMP-001",
            "purchase_date": today_str,
            "duration_months": 6,
        },
    ).json()
    p_id = reg["id"]

    # Update
    up_res = client.put(
        f"/api/v1/products/{p_id}",
        json={"product_name": "Temp Monitor v2", "brand": "LG"},
    )
    assert up_res.status_code == 200
    assert up_res.json()["product_name"] == "Temp Monitor v2"

    # Delete
    del_res = client.delete(f"/api/v1/products/{p_id}")
    assert del_res.status_code == 204

    # Verify 404
    get_res = client.get(f"/api/v1/products/{p_id}")
    assert get_res.status_code == 404
