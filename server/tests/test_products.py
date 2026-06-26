"""
Module: test_products
Purpose: Test products and categories endpoints.
"""

import pytest
from server.app.models import Category, Product, Review


@pytest.fixture
def seed_products_data(db, test_user):
    # Create categories
    womens = Category(name="Women's Clothing")
    db.add(womens)
    db.flush()

    dresses = Category(name="Dresses", parent_id=womens.id)
    db.add(dresses)
    db.flush()

    # Create products
    p1 = Product(
        name="Floral Summer Maxi Dress",
        description="A light, breezy floral summer maxi dress.",
        price=89.00,
        image_url="http://example.com/dress1.jpg",
        stock=10,
        category_id=dresses.id,
        brand="Aura Basic",
        size="M",
        color="White",
        rating=4.8,
    )
    p2 = Product(
        name="Classic Linen Button-Down",
        description="A classic crisp white linen button-down shirt.",
        price=59.00,
        image_url="http://example.com/shirt1.jpg",
        stock=5,
        category_id=womens.id,
        brand="Urban Knit",
        size="S",
        color="Blue",
        rating=4.5,
    )
    db.add_all([p1, p2])
    db.flush()

    # Add review
    r1 = Review(
        product_id=p1.id, user_id=test_user.id, rating=5, comment="Beautiful dress!"
    )
    db.add(r1)
    db.commit()
    return dresses.id, p1.id, p2.id


def test_get_categories(client, seed_products_data):
    # AC 1: View products organized by categories and sub-categories
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Women's Clothing"
    assert len(data[0]["subcategories"]) > 0
    assert data[0]["subcategories"][0]["name"] == "Dresses"


def test_list_products(client, seed_products_data):
    # AC 2: Each product listing displays the product name, price, and an image
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    assert "items" in data
    item = data["items"][0]
    assert "name" in item
    assert "price" in item
    assert "image_url" in item


def test_get_product_detail(client, seed_products_data):
    # AC 3: Click on a product to view detailed description, multiple images, and customer reviews
    _, p1_id, _ = seed_products_data
    response = client.get(f"/api/v1/products/{p1_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Floral Summer Maxi Dress"
    assert data["description"] == "A light, breezy floral summer maxi dress."
    assert len(data["reviews"]) > 0
    assert data["reviews"][0]["comment"] == "Beautiful dress!"
    assert len(data["images"]) == 1
    assert data["images"][0] == "http://example.com/dress1.jpg"


def test_get_product_not_found(client):
    # AC: Requesting a non-existent product returns 404
    response = client.get("/api/v1/products/non-existent-id")
    assert response.status_code == 404


def test_list_products_sorting(client, seed_products_data):
    # AC 5: Sort products by price (low to high, high to low), popularity, and new arrivals
    response_asc = client.get("/api/v1/products?sort_by=price_asc")
    assert response_asc.status_code == 200
    items_asc = response_asc.json()["items"]
    assert items_asc[0]["price"] <= items_asc[1]["price"]

    response_desc = client.get("/api/v1/products?sort_by=price_desc")
    assert response_desc.status_code == 200
    items_desc = response_desc.json()["items"]
    assert items_desc[0]["price"] >= items_desc[1]["price"]


def test_list_products_filtering(client, seed_products_data):
    # AC 6: Filter products by size, color, and brand
    response = client.get("/api/v1/products?size=M&color=White&brand=Aura+Basic")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Floral Summer Maxi Dress"


def test_list_products_search(client, seed_products_data):
    # AC 7, 9: Search for products by name, category, or keywords
    response = client.get("/api/v1/products?search=Linen")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Classic Linen Button-Down"


def test_search_suggestions(client, seed_products_data):
    # AC 8: The search provides auto-suggestions as I type
    response = client.get("/api/v1/products/suggestions?q=Flor")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0] == "Floral Summer Maxi Dress"


def test_empty_search_yields_suggestions(client, seed_products_data):
    # AC 11: If a search yields no results, suggestions for other products are returned
    response = client.get("/api/v1/products?search=NonExistentProduct")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["suggestions"]) > 0
    assert data["suggestions"][0]["name"] == "Floral Summer Maxi Dress"
