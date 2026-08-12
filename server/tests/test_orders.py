def test_order_tracking_and_cancellation_flow(client):
    cart_id = "cart-order-flow"
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
            "customer_email": "canceltest@example.com",
            "shipping_address": {
                "full_name": "Charlie Cancel",
                "address_line1": "789 Quiet Ln",
                "city": "Seattle",
                "state": "WA",
                "postal_code": "98101",
                "country": "US",
            },
        },
    )
    order_number = checkout_res.json()["order_number"]

    # 1. Get order detail
    get_res = client.get(f"/api/v1/orders/{order_number}")
    assert get_res.status_code == 200
    assert get_res.json()["status"] == "Order Placed"

    # 2. Cancel order when in 'Order Placed' state
    cancel_res = client.post(f"/api/v1/orders/{order_number}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "Cancelled"

    # 3. Attempting to cancel again should fail because state is 'Cancelled'
    cancel_again = client.post(f"/api/v1/orders/{order_number}/cancel")
    assert cancel_again.status_code == 400
    assert "not permitted" in cancel_again.json()["detail"].lower()
