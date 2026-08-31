def test_place_order_standard_shipping(client):
    choc = client.get("/api/v1/chocolates").json()[0]
    choc_id = choc["id"]
    init_stock = choc["stock_quantity"]

    # Add item to cart
    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": choc_id, "quantity": 2}
    )
    cart_id = add_resp.json()["cart_id"]

    order_payload = {
        "cart_id": cart_id,
        "customer_name": "Jane Gourmet",
        "customer_email": "jane@example.com",
        "shipping_address": "123 Cocoa Blossom Lane, Suite 4B, San Francisco, CA 94107",
        "shipping_method": "standard_ground",
    }

    resp = client.post("/api/v1/orders", json=order_payload)
    assert resp.status_code == 201
    data = resp.json()

    assert "id" in data
    assert "order_code" in data
    assert data["order_code"].startswith("ORD-")
    assert data["status"] == "Processing"
    assert data["order_status"] == "Processing"
    assert data["shipping_fee"] == 0.0
    assert data["subtotal_amount"] == round(choc["price"] * 2, 2)
    assert data["total_amount"] == round(choc["price"] * 2, 2)
    assert len(data["items"]) == 1

    # Check cart is cleared
    cart_resp = client.get(f"/api/v1/cart?cart_id={cart_id}")
    assert len(cart_resp.json()["items"]) == 0

    # Check inventory was decremented
    updated_choc = client.get(f"/api/v1/chocolates/{choc_id}").json()
    assert updated_choc["stock_quantity"] == init_stock - 2


def test_place_order_express_thermal_shipping(client):
    choc = client.get("/api/v1/chocolates").json()[1]
    choc_id = choc["id"]

    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": choc_id, "quantity": 1}
    )
    cart_id = add_resp.json()["cart_id"]

    order_payload = {
        "cart_id": cart_id,
        "customer_name": "Arthur Dent",
        "customer_email": "arthur@example.com",
        "shipping_address": "42 Galaxy Way, London, UK",
        "shipping_method": "express_thermal",
    }

    resp = client.post("/api/v1/orders", json=order_payload)
    assert resp.status_code == 201
    data = resp.json()

    assert data["shipping_method"] == "express_thermal"
    assert data["shipping_fee"] == 15.00
    assert data["total_amount"] == round(choc["price"] + 15.00, 2)


def test_get_order_by_id_and_code(client):
    choc = client.get("/api/v1/chocolates").json()[0]
    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": choc["id"], "quantity": 1}
    )
    cart_id = add_resp.json()["cart_id"]

    order_resp = client.post(
        "/api/v1/orders",
        json={
            "cart_id": cart_id,
            "customer_name": "Tasting Club",
            "customer_email": "club@tasting.org",
            "shipping_address": "77 Artisan Way, Seattle, WA",
            "shipping_method": "standard_ground",
        },
    )
    order_data = order_resp.json()
    order_id = order_data["id"]
    order_code = order_data["order_code"]

    # Fetch by UUID
    fetch_by_id = client.get(f"/api/v1/orders/{order_id}")
    assert fetch_by_id.status_code == 200
    assert fetch_by_id.json()["id"] == order_id

    # Fetch by Order Code
    fetch_by_code = client.get(f"/api/v1/orders/{order_code}")
    assert fetch_by_code.status_code == 200
    assert fetch_by_code.json()["order_code"] == order_code


def test_get_nonexistent_order(client):
    resp = client.get("/api/v1/orders/ORD-NONEXISTENT")
    assert resp.status_code == 404
    assert "detail" in resp.json()


def test_order_empty_cart(client):
    empty_cart_resp = client.get("/api/v1/cart")
    empty_cart_id = empty_cart_resp.json()["cart_id"]

    resp = client.post(
        "/api/v1/orders",
        json={
            "cart_id": empty_cart_id,
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "shipping_address": "123 Main St, Anytown",
            "shipping_method": "standard_ground",
        },
    )
    assert resp.status_code == 400
    assert "empty" in resp.json()["detail"].lower()


def test_order_validation_error(client):
    # Invalid email
    resp = client.post(
        "/api/v1/orders",
        json={
            "cart_id": "invalid-cart",
            "customer_name": "Test User",
            "customer_email": "not-an-email",
            "shipping_address": "123 Main St",
            "shipping_method": "standard_ground",
        },
    )
    assert resp.status_code == 422
