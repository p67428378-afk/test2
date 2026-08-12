def test_admin_create_and_update_painting(client):
    create_payload = {
        "title": "Neon Sunset",
        "description": "Vibrant synthwave aesthetic wall painting.",
        "artist_name": "Cyber Artist",
        "medium": "Acrylic",
        "style": "Modern",
        "base_price": 299.99,
        "is_configurable": True,
        "is_original_one_of_one": False,
        "stock_quantity": 10,
        "status": "ACTIVE",
    }

    create_res = client.post("/api/v1/admin/paintings", json=create_payload)
    assert create_res.status_code == 201
    painting_data = create_res.json()
    painting_id = painting_data["id"]
    assert painting_data["title"] == "Neon Sunset"

    # Update stock
    update_res = client.put(
        f"/api/v1/admin/paintings/{painting_id}",
        json={"stock_quantity": 5, "base_price": 349.99},
    )
    assert update_res.status_code == 200
    assert update_res.json()["stock_quantity"] == 5


def test_admin_update_order_status(client):
    cart_id = "cart-admin-test"
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    client.post(
        "/api/v1/cart/items",
        json={"cart_id": cart_id, "painting_id": painting_id, "quantity": 1},
    )

    checkout_res = client.post(
        "/api/v1/checkout/intent",
        json={
            "cart_id": cart_id,
            "customer_email": "adminorder@example.com",
            "shipping_address": {
                "full_name": "Admin Customer",
                "address_line1": "100 Main St",
                "city": "Boston",
                "state": "MA",
                "postal_code": "02108",
                "country": "US",
            },
        },
    )
    order_number = checkout_res.json()["order_number"]

    # Admin updates status to Shipped with tracking number
    patch_res = client.patch(
        f"/api/v1/admin/orders/{order_number}",
        json={"status": "Shipped", "tracking_number": "TRACK-123456789"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Shipped"
    assert patch_res.json()["tracking_number"] == "TRACK-123456789"
