"""
Module: server.tests.test_payments
Purpose: Test payment endpoints.
"""


def test_payment_success(client, restaurant_token, customer_token):
    # AC: Given I have selected my items, when I proceed to checkout, then I can add or select a delivery address, make a secure online payment, and receive an order confirmation.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Sushi House", "cuisine": "Japanese", "delivery_fee": 5.00},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Salmon Roll", "price": 10.00},
        headers={"Authorization": restaurant_token},
    )
    menu_item_id = menu_response.json()["id"]

    # 3. Create order
    order_response = client.post(
        "/api/v1/orders",
        json={
            "restaurant_id": restaurant_id,
            "delivery_address": "789 Maple Ave",
            "items": [{"menu_item_id": menu_item_id, "quantity": 1}],
        },
        headers={"Authorization": customer_token},
    )
    order_data = order_response.json()
    order_id = order_data["id"]
    total_amount = order_data["total_amount"]

    # 4. Process payment
    payment_response = client.post(
        "/api/v1/payments",
        json={
            "amount": total_amount,
            "order_id": order_id,
            "payment_method": "credit_card",
        },
        headers={"Authorization": customer_token},
    )
    assert payment_response.status_code == 201
    payment_data = payment_response.json()
    assert payment_data["status"] == "completed"
    assert payment_data["order_id"] == order_id
    assert "transaction_id" in payment_data

    # 5. Verify order payment status is updated to paid
    order_detail = client.get(
        f"/api/v1/orders/{order_id}", headers={"Authorization": customer_token}
    )
    assert order_detail.status_code == 200
    assert order_detail.json()["payment_status"] == "paid"


def test_payment_amount_mismatch_fails(client, restaurant_token, customer_token):
    # AC: Given I have selected my items, when I proceed to checkout, then I can add or select a delivery address, make a secure online payment, and receive an order confirmation.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Sushi House", "cuisine": "Japanese", "delivery_fee": 5.00},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Salmon Roll", "price": 10.00},
        headers={"Authorization": restaurant_token},
    )
    menu_item_id = menu_response.json()["id"]

    # 3. Create order
    order_response = client.post(
        "/api/v1/orders",
        json={
            "restaurant_id": restaurant_id,
            "delivery_address": "789 Maple Ave",
            "items": [{"menu_item_id": menu_item_id, "quantity": 1}],
        },
        headers={"Authorization": customer_token},
    )
    order_data = order_response.json()
    order_id = order_data["id"]

    # 4. Process payment with wrong amount
    payment_response = client.post(
        "/api/v1/payments",
        json={"amount": 999.99, "order_id": order_id, "payment_method": "credit_card"},
        headers={"Authorization": customer_token},
    )
    assert payment_response.status_code == 400
    assert "Payment amount mismatch" in payment_response.json()["detail"]
