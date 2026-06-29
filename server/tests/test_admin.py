"""
Module: server.tests.test_admin
Purpose: Test admin and support ticket endpoints.
"""


def test_get_metrics_success(client, admin_token):
    # AC: Given I want to monitor platform health, when I view the main dashboard, then I can see key metrics like total orders, revenue, and active users.
    response = client.get(
        "/api/v1/admin/metrics", headers={"Authorization": admin_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "active_drivers" in data
    assert "active_restaurants" in data
    assert "active_users" in data
    assert "total_orders" in data
    assert "total_revenue" in data


def test_get_metrics_unauthorized_fails(client, customer_token):
    # AC: Given I want to monitor platform health, when I view the main dashboard, then I can see key metrics like total orders, revenue, and active users.
    response = client.get(
        "/api/v1/admin/metrics", headers={"Authorization": customer_token}
    )
    assert response.status_code == 403


def test_support_ticket_workflow(client, customer_token, admin_token):
    # AC: Given I need to resolve an issue, when I access the support dashboard, then I can manage customer inquiries, process refunds, and oversee disputes.
    # 1. Customer creates a support ticket
    ticket_response = client.post(
        "/api/v1/admin/tickets",
        json={
            "issue_type": "Refund Request",
            "description": "I did not receive my food.",
        },
        headers={"Authorization": customer_token},
    )
    assert ticket_response.status_code == 201
    ticket_data = ticket_response.json()
    assert ticket_data["issue_type"] == "Refund Request"
    assert ticket_data["status"] == "open"
    ticket_id = ticket_data["id"]

    # 2. Admin lists support tickets
    list_response = client.get(
        "/api/v1/admin/tickets", headers={"Authorization": admin_token}
    )
    assert list_response.status_code == 200
    assert len(list_response.json()) >= 1

    # 3. Admin resolves the support ticket
    resolve_response = client.put(
        f"/api/v1/admin/tickets/{ticket_id}/resolve",
        headers={"Authorization": admin_token},
    )
    assert resolve_response.status_code == 200
    assert resolve_response.json()["status"] == "resolved"


def test_admin_user_management(client, admin_token):
    # AC: Given I am an administrator, when I log into the admin panel, then I can view and manage all users (customers, restaurants, delivery partners).
    # 1. List users
    list_response = client.get(
        "/api/v1/admin/users", headers={"Authorization": admin_token}
    )
    assert list_response.status_code == 200
    users = list_response.json()
    assert len(users) >= 1

    # Find a user to update
    user_id = users[0]["id"]

    # 2. Update user
    update_response = client.put(
        f"/api/v1/admin/users/{user_id}",
        json={"full_name": "Updated Name By Admin"},
        headers={"Authorization": admin_token},
    )
    assert update_response.status_code == 200
    assert update_response.json()["full_name"] == "Updated Name By Admin"

    # 3. Delete user
    delete_response = client.delete(
        f"/api/v1/admin/users/{user_id}", headers={"Authorization": admin_token}
    )
    assert delete_response.status_code == 204


def test_admin_process_refund(client, restaurant_token, customer_token, admin_token):
    # AC: Given I need to resolve an issue, when I access the support dashboard, then I can manage customer inquiries, process refunds, and oversee disputes.
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
    client.post(
        "/api/v1/payments",
        json={
            "amount": total_amount,
            "order_id": order_id,
            "payment_method": "credit_card",
        },
        headers={"Authorization": customer_token},
    )

    # 5. Admin processes refund
    refund_response = client.post(
        f"/api/v1/admin/orders/{order_id}/refund",
        headers={"Authorization": admin_token},
    )
    assert refund_response.status_code == 200
    assert refund_response.json()["payment_status"] == "refunded"
    assert refund_response.json()["status"] == "cancelled"
