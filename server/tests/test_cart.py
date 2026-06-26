"""
Module: test_cart
Purpose: Test shopping cart endpoints.
"""

import pytest
from server.app.models import Category, Product


@pytest.fixture
def seed_product(db):
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
    db.commit()
    return p.id


def test_cart_operations(client, user_token, seed_product):
    headers = {"Authorization": f"Bearer {user_token}"}

    # Get cart (should be empty)
    response = client.get("/api/v1/cart", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) == 0
    assert response.json()["total_price"] == 0.0

    # Add item to cart
    response = client.post(
        "/api/v1/cart",
        json={"product_id": seed_product, "quantity": 2},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Get cart again (should have 1 item with quantity 2)
    response = client.get("/api/v1/cart", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["product_id"] == seed_product
    assert data["items"][0]["quantity"] == 2
    assert data["total_price"] == 20.0


def test_cart_insufficient_stock(client, user_token, seed_product):
    headers = {"Authorization": f"Bearer {user_token}"}

    # Add item with quantity exceeding stock (stock is 5)
    response = client.post(
        "/api/v1/cart",
        json={"product_id": seed_product, "quantity": 10},
        headers=headers,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient stock"
