"""
Module: server.tests.test_restaurants
Purpose: Test restaurant and menu endpoints.
"""


def test_create_restaurant_success(client, restaurant_token):
    # AC: Given I am a restaurant partner, when I log into my dashboard, then I can manage my restaurant's profile, update menu items, and set operating hours.
    response = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Pizza Palace",
            "cuisine": "Italian",
            "address": "456 Pizza Way",
            "operating_hours": "10:00 AM - 10:00 PM",
            "delivery_fee": 3.99,
            "delivery_time": 25,
        },
        headers={"Authorization": restaurant_token},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Pizza Palace"
    assert data["cuisine"] == "Italian"
    assert data["delivery_fee"] == 3.99
    assert data["delivery_time"] == 25


def test_create_restaurant_unauthorized_fails(client, customer_token):
    # AC: Given I am a restaurant partner, when I log into my dashboard, then I can manage my restaurant's profile, update menu items, and set operating hours.
    response = client.post(
        "/api/v1/restaurants",
        json={"name": "Pizza Palace", "cuisine": "Italian"},
        headers={"Authorization": customer_token},
    )
    assert response.status_code == 403


def test_add_menu_item_success(client, restaurant_token):
    # AC: Given I am a restaurant partner, when I log into my dashboard, then I can manage my restaurant's profile, update menu items, and set operating hours.
    # Create restaurant first
    res_response = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Burger Joint",
            "cuisine": "American",
            "operating_hours": "11:00 AM - 11:00 PM",
        },
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={
            "name": "Classic Cheeseburger",
            "price": 9.99,
            "description": "Juicy beef patty with cheddar cheese",
            "is_available": True,
        },
        headers={"Authorization": restaurant_token},
    )
    assert menu_response.status_code == 201
    menu_data = menu_response.json()
    assert menu_data["name"] == "Classic Cheeseburger"
    assert menu_data["price"] == 9.99
    assert menu_data["restaurant_id"] == restaurant_id


def test_add_menu_item_unauthorized_fails(client, restaurant_token, customer_token):
    # AC: Given I am a restaurant partner, when I log into my dashboard, then I can manage my restaurant's profile, update menu items, and set operating hours.
    # Create restaurant with restaurant partner
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Burger Joint", "cuisine": "American"},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # Try to add menu item with customer token
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Classic Cheeseburger", "price": 9.99},
        headers={"Authorization": customer_token},
    )
    assert menu_response.status_code == 403


def test_list_and_filter_restaurants(client, restaurant_token, customer_token):
    # AC: Given I am logged in, when I browse the platform, then I can view a list of available restaurants, filter them by cuisine or rating, and view their menus.
    # Create Italian restaurant
    client.post(
        "/api/v1/restaurants",
        json={"name": "Italian Bistro", "cuisine": "Italian"},
        headers={"Authorization": restaurant_token},
    )
    # Create Mexican restaurant
    client.post(
        "/api/v1/restaurants",
        json={"name": "Taco Fiesta", "cuisine": "Mexican"},
        headers={"Authorization": restaurant_token},
    )

    # List all
    response = client.get(
        "/api/v1/restaurants", headers={"Authorization": customer_token}
    )
    assert response.status_code == 200
    assert len(response.json()) >= 2

    # Filter by cuisine
    response_filtered = client.get(
        "/api/v1/restaurants?cuisine=Italian", headers={"Authorization": customer_token}
    )
    assert response_filtered.status_code == 200
    data = response_filtered.json()
    assert len(data) == 1
    assert data[0]["name"] == "Italian Bistro"


def test_update_restaurant_and_menu_item(client, restaurant_token):
    # AC: Given I am a restaurant partner, when I log into my dashboard, then I can manage my restaurant's profile, update menu items, and set operating hours.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Burger Joint",
            "cuisine": "American",
            "operating_hours": "11:00 AM - 11:00 PM",
        },
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Update restaurant profile
    update_res_response = client.put(
        f"/api/v1/restaurants/{restaurant_id}",
        json={"name": "Updated Burger Joint", "operating_hours": "12:00 PM - 12:00 AM"},
        headers={"Authorization": restaurant_token},
    )
    assert update_res_response.status_code == 200
    assert update_res_response.json()["name"] == "Updated Burger Joint"
    assert update_res_response.json()["operating_hours"] == "12:00 PM - 12:00 AM"

    # 3. Add menu item
    menu_response = client.post(
        f"/api/v1/restaurants/{restaurant_id}/menu",
        json={"name": "Classic Cheeseburger", "price": 9.99},
        headers={"Authorization": restaurant_token},
    )
    menu_item_id = menu_response.json()["id"]

    # 4. Update menu item
    update_menu_response = client.put(
        f"/api/v1/restaurants/{restaurant_id}/menu/{menu_item_id}",
        json={"name": "Updated Cheeseburger", "price": 10.99},
        headers={"Authorization": restaurant_token},
    )
    assert update_menu_response.status_code == 200
    assert update_menu_response.json()["name"] == "Updated Cheeseburger"
    assert update_menu_response.json()["price"] == 10.99


def test_get_restaurant_analytics(client, restaurant_token):
    # AC: Given an order is completed, when I view my analytics, then I can see my sales history and customer feedback.
    # 1. Create restaurant
    res_response = client.post(
        "/api/v1/restaurants",
        json={"name": "Burger Joint", "cuisine": "American"},
        headers={"Authorization": restaurant_token},
    )
    restaurant_id = res_response.json()["id"]

    # 2. Get analytics
    analytics_response = client.get(
        f"/api/v1/restaurants/{restaurant_id}/analytics",
        headers={"Authorization": restaurant_token},
    )
    assert analytics_response.status_code == 200
    data = analytics_response.json()
    assert data["restaurant_id"] == restaurant_id
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "sales_history" in data
    assert "feedback" in data
