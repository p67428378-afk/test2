def test_checkout_intent_successful(client):
    cart_id = "test-cart-checkout-1"
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    # Add item
    client.post(
        "/api/v1/cart/items",
        json={"cart_id": cart_id, "painting_id": painting_id, "quantity": 1},
    )

    checkout_payload = {
        "cart_id": cart_id,
        "customer_email": "artcollector@example.com",
        "shipping_address": {
            "full_name": "Alice Art",
            "address_line1": "123 Gallery Way",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "US",
        },
        "promo_code": "ART10",
    }

    res = client.post(
        "/api/v1/checkout/intent",
        json=checkout_payload,
        headers={"X-Idempotency-Key": "test-idem-key-999"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "order_number" in data
    assert data["customer_email"] == "artcollector@example.com"
    assert float(data["total_amount"]) > 0

    # Test Idempotency
    idem_res = client.post(
        "/api/v1/checkout/intent",
        json=checkout_payload,
        headers={"X-Idempotency-Key": "test-idem-key-999"},
    )
    assert idem_res.status_code == 200
    assert idem_res.json()["order_number"] == data["order_number"]


def test_checkout_empty_cart(client):
    checkout_payload = {
        "cart_id": "empty-cart-999",
        "customer_email": "bob@example.com",
        "shipping_address": {
            "full_name": "Bob Builder",
            "address_line1": "456 Construction Rd",
            "city": "Austin",
            "state": "TX",
            "postal_code": "78701",
            "country": "US",
        },
    }
    res = client.post("/api/v1/checkout/intent", json=checkout_payload)
    assert res.status_code == 400
    assert "empty cart" in res.json()["detail"].lower()
