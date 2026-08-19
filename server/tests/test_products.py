from datetime import date


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_and_get_product(client):
    today = date.today().isoformat()
    payload = {
        "product_name": "Dell XPS 15 Laptop",
        "serial_number": "DXPS15-998822",
        "brand": "Dell",
        "category": "Electronics",
        "purchase_date": today,
        "duration_months": 12,
        "vendor_name": "Best Buy",
    }

    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["product_name"] == "Dell XPS 15 Laptop"
    assert data["serial_number"] == "DXPS15-998822"
    assert data["warranty"] is not None
    assert data["warranty"]["status"] == "ACTIVE"
    product_id = data["id"]

    # Get product details
    detail_res = client.get(f"/api/v1/products/{product_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == product_id


def test_list_products_and_stats(client):
    today = date.today().isoformat()
    # Register a product for this test
    client.post(
        "/api/v1/products",
        json={
            "product_name": "iPad Air",
            "serial_number": "IPAD-AIR-554",
            "brand": "Apple",
            "category": "Tablets",
            "purchase_date": today,
            "duration_months": 12,
            "vendor_name": "Apple Store",
        },
    )

    # Get stats
    stats_res = client.get("/api/v1/products/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_products" in stats
    assert "active" in stats
    assert "expiring_soon" in stats
    assert "expired" in stats

    # List products
    list_res = client.get("/api/v1/products")
    assert list_res.status_code == 200
    products = list_res.json()
    assert isinstance(products, list)
    assert len(products) >= 1


def test_update_and_delete_product(client):
    today = date.today().isoformat()
    payload = {
        "product_name": "Sony Headphones",
        "serial_number": "SONY-1000XM4",
        "brand": "Sony",
        "category": "Audio",
        "purchase_date": today,
        "duration_months": 24,
        "vendor_name": "Amazon",
    }

    create_res = client.post("/api/v1/products", json=payload)
    product_id = create_res.json()["id"]

    # Update product
    update_res = client.put(
        f"/api/v1/products/{product_id}",
        json={
            "product_name": "Sony WH-1000XM4 Headphones",
            "vendor_name": "Sony Official Store",
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["product_name"] == "Sony WH-1000XM4 Headphones"
    assert update_res.json()["warranty"]["vendor_name"] == "Sony Official Store"

    # Delete product
    delete_res = client.delete(f"/api/v1/products/{product_id}")
    assert delete_res.status_code == 204

    # Verify 404 on get
    get_res = client.get(f"/api/v1/products/{product_id}")
    assert get_res.status_code == 404


def test_expiry_evaluation_endpoint(client):
    res = client.post("/api/v1/expiry/evaluate")
    assert res.status_code == 200
    assert "evaluated_count" in res.json()
