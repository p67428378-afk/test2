"""
Module: server.tests.test_deliveries
Purpose: Test delivery endpoints.
"""


def test_driver_availability(client, driver_token):
    # AC: Given I am a delivery partner, when I log into the app, then I can set my availability to 'Online' or 'Offline'.
    response = client.put(
        "/api/v1/users/availability?is_online=false",
        headers={"Authorization": driver_token},
    )
    assert response.status_code == 200
    assert response.json()["is_online"] is False


def test_delivery_workflow(client, restaurant_token, customer_token, driver_token):
    # AC: Given I am online, when a restaurant marks an order as 'Ready for Pickup', then I can receive a notification for the delivery task.
    # AC: Given I have accepted a delivery, when I am en route, then my real-time location is shared with the customer.
    # AC: Given I have delivered the order, when I complete the task in the app, then I can confirm the delivery and view my earnings.

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
    order_id = order_response.json()["id"]

    # 4. Accept, prepare, and mark ready for pickup
    client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "accepted"},
        headers={"Authorization": restaurant_token},
    )
    client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "preparing"},
        headers={"Authorization": restaurant_token},
    )
    client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "ready_for_pickup"},
        headers={"Authorization": restaurant_token},
    )

    # 5. Driver lists available deliveries
    avail_response = client.get(
        "/api/v1/deliveries/available", headers={"Authorization": driver_token}
    )
    assert avail_response.status_code == 200
    avail_data = avail_response.json()
    assert len(avail_data) == 1
    delivery_id = avail_data[0]["id"]

    # 6. Driver accepts delivery
    accept_response = client.put(
        f"/api/v1/deliveries/{delivery_id}/accept",
        headers={"Authorization": driver_token},
    )
    assert accept_response.status_code == 200
    assert accept_response.json()["status"] == "accepted"

    # 7. Driver updates location
    loc_response = client.put(
        f"/api/v1/deliveries/{delivery_id}/location",
        json={"latitude": 40.7128, "longitude": -74.0060},
        headers={"Authorization": driver_token},
    )
    assert loc_response.status_code == 200
    assert loc_response.json()["current_latitude"] == 40.7128
    assert loc_response.json()["current_longitude"] == -74.0060

    # 8. Driver marks order as out for delivery
    out_response = client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "out_for_delivery"},
        headers={"Authorization": driver_token},
    )
    assert out_response.status_code == 200
    assert out_response.json()["status"] == "out_for_delivery"

    # 9. Driver marks order as delivered
    delivered_response = client.put(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "delivered"},
        headers={"Authorization": driver_token},
    )
    assert delivered_response.status_code == 200
    assert delivered_response.json()["status"] == "delivered"

    # 10. Verify delivery earnings
    deliv_detail = client.get(
        f"/api/v1/deliveries/{delivery_id}", headers={"Authorization": driver_token}
    )
    assert deliv_detail.status_code == 200
    assert deliv_detail.json()["earnings"] == 4.00  # 80% of 5.00 delivery fee


def test_driver_offline_cannot_view_or_accept_tasks(
    client, restaurant_token, customer_token, driver_token
):
    # AC: Given I am online, when a restaurant marks an order as 'Ready for Pickup', then I can receive a notification for the delivery task.

    # 1. Set driver offline
    client.put(
        "/api/v1/users/availability?is_online=false",
        headers={"Authorization": driver_token},
    )

    # 2. Try to view available tasks
    avail_response = client.get(
        "/api/v1/deliveries/available", headers={"Authorization": driver_token}
    )
    assert avail_response.status_code == 400
    assert "must set your availability to Online" in avail_response.json()["detail"]
