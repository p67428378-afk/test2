"""
Module: server.tests.test_orders
Purpose: Test order endpoints.
"""


def test_create_order_success(client, restaurant_token, customer_token):
    # AC: Given I have selected my items, when I proceed to checkout, then I can add or select a delivery address, make a secure online payment, and receive an order confirmation.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Sushi House", "cuisine": "Japanese", "delivery_fee": 2.50},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Salmon Roll", "price": 12.00},
        headers={"Authorization": restaurant_token},
    )
    menu_item_id = menu_response.json()["id"]

    # 3. Create order
    order_response = client.post(
        "/api/v1/orders",
        json={
            "restaurant_id": restaurant_id,
            "delivery_address": "789 Maple Ave",
            "items": [{"menu_item_id": menu_item_id, "quantity": 2}],
        },
        headers={"Authorization": customer_token},
    )
    assert order_response.status_code == 201
    order_data = order_response.json()
    assert order_data["status"] == "pending"
    assert order_data["delivery_address"] == "789 Maple Ave"
    assert order_data["total_amount"] == 26.50  # (12.00 * 2) + 2.50 delivery fee
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["menu_item_id"] == menu_item_id


def test_update_order_status_by_restaurant(client, restaurant_token, customer_token):
    # AC: Given a customer places an order, when I view my order queue, then I can accept or decline the new order.
    # AC: Given I have accepted an order, when the food is prepared, then I can mark the order as 'Ready for Pickup' to notify a delivery partner.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Sushi House", "cuisine": "Japanese", "delivery_fee": 2.50},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Salmon Roll", "price": 12.00},
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
    order_id = order_response.json()["id"]

    # 4. Accept order
    accept_response = client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "accepted"},
        headers={"Authorization": restaurant_token},
    )
    assert accept_response.status_code == 200
    assert accept_response.json()["status"] == "accepted"

    # 5. Mark as preparing
    preparing_response = client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "preparing"},
        headers={"Authorization": restaurant_token},
    )
    assert preparing_response.status_code == 200
    assert preparing_response.json()["status"] == "preparing"

    # 6. Mark as ready for pickup
    ready_response = client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "ready_for_pickup"},
        headers={"Authorization": restaurant_token},
    )
    assert ready_response.status_code == 200
    assert ready_response.json()["status"] == "ready_for_pickup"
