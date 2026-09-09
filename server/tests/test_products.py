"""Tests for Product Catalog API endpoints."""


def test_health_check(client):
    """Verify health check endpoint returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_list_products_default(client):
    """Verify default product listing returns seeded items with pagination metadata."""
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["skip"] == 0
    assert data["limit"] == 20
    assert len(data["items"]) > 0


def test_list_products_filter_by_category(client):
    """Verify category filtering returns only matching products."""
    response = client.get("/api/v1/products?category=electronics")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert "electronics" in item["category"].lower()


def test_list_products_search(client):
    """Verify search filter matches title or description."""
    response = client.get("/api/v1/products?search=Headphones")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert any("Headphones" in item["name"] for item in data["items"])


def test_create_and_get_product(client):
    """Verify product creation and retrieval by ID."""
    new_prod = {
        "name": "Mechanical Gaming Mouse",
        "description": "High precision 16000 DPI gaming mouse with customizable RGB.",
        "category": "electronics",
        "price": 59.99,
        "rating": 4.6,
        "tags": ["mouse", "gaming", "rgb"],
        "in_stock": True,
    }
    create_res = client.post("/api/v1/products", json=new_prod)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == new_prod["name"]
    prod_id = created_data["id"]

    # Retrieve by ID
    get_res = client.get(f"/api/v1/products/{prod_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == prod_id
    assert get_res.json()["price"] == 59.99


def test_get_product_not_found(client):
    """Verify 404 response for non-existent product ID."""
    response = client.get("/api/v1/products/non-existent-uuid-9999")
    assert response.status_code == 404
