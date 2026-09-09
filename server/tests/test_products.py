def test_list_products_default(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] > 0
    assert len(data["items"]) <= 20
    assert data["skip"] == 0
    assert data["limit"] == 20


def test_list_products_category_filter(client):
    response = client.get("/api/v1/products?category=electronics")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    for item in data["items"]:
        assert item["category"].lower() == "electronics"


def test_list_products_search_filter(client):
    response = client.get("/api/v1/products?search=Headphones")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("headphones" in item["name"].lower() for item in data["items"])


def test_list_products_pagination(client):
    response = client.get("/api/v1/products?skip=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["skip"] == 1
    assert data["limit"] == 2


def test_list_products_invalid_pagination_fallback(client):
    response = client.get("/api/v1/products?skip=-5&limit=-10")
    assert response.status_code == 200
    data = response.json()
    assert data["skip"] == 0
    assert data["limit"] == 20


def test_list_products_empty_category_fallback(client):
    response = client.get("/api/v1/products?category=")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0


def test_get_product_by_id(client):
    # First get product list to fetch an existing id
    list_res = client.get("/api/v1/products")
    items = list_res.json()["items"]
    assert len(items) > 0
    prod_id = items[0]["id"]

    res = client.get(f"/api/v1/products/{prod_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == prod_id
    assert "name" in data
    assert "price" in data


def test_get_product_not_found(client):
    res = client.get("/api/v1/products/non-existent-uuid-123")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


def test_create_product(client):
    payload = {
        "name": "Custom Test Gadget",
        "description": "A novel test gadget for testing API.",
        "category": "gadgets",
        "price": 79.99,
        "rating": 4.2,
        "tags": ["test", "gadget", "new"],
        "in_stock": True,
    }
    res = client.post("/api/v1/products", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == payload["name"]
    assert data["price"] == payload["price"]
    assert "id" in data
