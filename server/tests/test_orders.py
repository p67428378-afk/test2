def test_checkout_empty_cart(client):
    payload = {
        "payment_method_id": "pm_mock_123",
        "shipping_address": {
            "full_name": "John Doe",
            "address_line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
    }
    response = client.post("/api/v1/orders/checkout", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Cart is empty"


def test_checkout_success(client):
    # Get a valid painting ID
    paintings_resp = client.get("/api/v1/paintings")
    painting = paintings_resp.json()["items"][0]
    painting_id = painting["id"]
    initial_stock = painting["stock"]

    # Add to cart
    client.post("/api/v1/cart/items", json={"painting_id": painting_id})

    # Checkout
    payload = {
        "payment_method_id": "pm_mock_123",
        "shipping_address": {
            "full_name": "John Doe",
            "address_line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
    }
    response = client.post("/api/v1/orders/checkout", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "order_id" in data
    assert data["status"] == "succeeded"

    # Verify stock decremented
    get_painting_resp = client.get(f"/api/v1/paintings/{painting_id}")
    assert get_painting_resp.json()["stock"] == initial_stock - 1

    # Verify order details
    order_id = data["order_id"]
    order_resp = client.get(f"/api/v1/orders/{order_id}")
    assert order_resp.status_code == 200
    order_data = order_resp.json()
    assert order_data["id"] == order_id
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["painting_id"] == painting_id


def test_checkout_payment_failed(client):
    # Get a valid painting ID
    paintings_resp = client.get("/api/v1/paintings")
    painting_id = paintings_resp.json()["items"][0]["id"]

    # Add to cart
    client.post("/api/v1/cart/items", json={"painting_id": painting_id})

    # Checkout with failing payment method
    payload = {
        "payment_method_id": "fail",
        "shipping_address": {
            "full_name": "John Doe",
            "address_line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
    }
    response = client.post("/api/v1/orders/checkout", json=payload)
    assert response.status_code == 402
    assert response.json()["detail"] == "Payment failed"
