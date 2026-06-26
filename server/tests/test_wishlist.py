"""
Module: test_wishlist
Purpose: Test wishlist endpoints.
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


def test_wishlist_operations(client, user_token, seed_product):
    headers = {"Authorization": f"Bearer {user_token}"}

    # AC 13: View wishlist (should be empty initially)
    response = client.get("/api/v1/wishlist", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 0

    # AC 12: Add product to wishlist
    response = client.post(
        "/api/v1/wishlist", json={"product_id": seed_product}, headers=headers
    )
    assert response.status_code == 201
    assert response.json()["status"] == "success"

    # View wishlist again (should have 1 item)
    response = client.get("/api/v1/wishlist", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["product_id"] == seed_product

    # AC 14: Remove item from wishlist
    response = client.delete(f"/api/v1/wishlist/{seed_product}", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # View wishlist again (should be empty)
    response = client.get("/api/v1/wishlist", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_wishlist_unauthenticated(client, seed_product):
    # AC: Wishlist operations without authentication return 401
    response = client.get("/api/v1/wishlist")
    assert response.status_code == 401

    response = client.post("/api/v1/wishlist", json={"product_id": seed_product})
    assert response.status_code == 401

    response = client.delete(f"/api/v1/wishlist/{seed_product}")
    assert response.status_code == 401
