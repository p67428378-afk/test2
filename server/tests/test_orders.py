"""
Module: test_orders
Purpose: Test orders endpoints.
"""

import pytest
from server.app.models import Category, Product


@pytest.fixture
def seed_product_and_cart(db, test_user):
    cat = Category(name="Test Category")
    db.add(cat)
    db.flush()
    p = Product(
        name="Test Product",
        description="Test Description",
        price=10.0,
        image_url="http://example.com/img.jpg",
        stock=5,
        category_id=cat.id,
        brand="Test Brand",
        size="M",
        color="Red",
    )
    db.add(p)
    db.flush()

    from server.app.models import Cart

    cart_item = Cart(user_id=test_user.id, product_id=p.id, quantity=2)
    db.add(cart_item)
    db.commit()
    return p.id


def test_create_order_success(client, user_token, seed_product_and_cart):
    headers = {"Authorization": f"Bearer {user_token}"}

    # Create order
    response = client.post(
        "/api/v1/orders",
        json={
            "shipping_address": "123 Main St",
            "payment_method": "Credit Card",
            "coupon_code": "SAVE10",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["status"] == "pending"
    # 10.0 * 2 = 20.0, with SAVE10 coupon (10% off) -> 18.0
    assert data["total_price"] == 18.0

    order_id = data["id"]

    # Get order by ID
    response = client.get(f"/api/v1/orders/{order_id}", headers=headers)
    assert response.status_code == 200
    order_data = response.json()
    assert order_data["id"] == order_id
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["quantity"] == 2
    assert order_data["items"][0]["price"] == 10.0


def test_create_order_empty_cart(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}

    # Create order with empty cart
    response = client.post(
        "/api/v1/orders",
        json={"shipping_address": "123 Main St", "payment_method": "Credit Card"},
        headers=headers,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Empty cart"
