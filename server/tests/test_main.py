import uuid


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Computer Parts Seller API"}


def test_get_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Check fields
    for cat in data:
        assert "id" in cat
        assert "name" in cat
        assert "description" in cat
        assert "created_at" in cat
        assert "updated_at" in cat


def test_get_category_by_id(client):
    # Get all categories first
    response = client.get("/api/v1/categories")
    categories = response.json()
    cat_id = categories[0]["id"]

    # Get by ID
    response = client.get(f"/api/v1/categories/{cat_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == cat_id
    assert "name" in data

    # Non-existent category
    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/categories/{random_uuid}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found"

    # Invalid UUID format
    response = client.get("/api/v1/categories/invalid-uuid")
    assert response.status_code == 422


def test_get_products(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0

    # Check fields
    for prod in data["items"]:
        assert "id" in prod
        assert "name" in prod
        assert "price" in prod
        assert "brand" in prod
        assert "stock_quantity" in prod
        assert "category_id" in prod


def test_get_product_by_id(client):
    # Get all products first
    response = client.get("/api/v1/products")
    products = response.json()["items"]
    prod_id = products[0]["id"]

    # Get by ID
    response = client.get(f"/api/v1/products/{prod_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == prod_id
    assert "name" in data

    # Non-existent product
    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/products/{random_uuid}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

    # Invalid UUID format
    response = client.get("/api/v1/products/invalid-uuid")
    assert response.status_code == 422


def test_get_category_products(client):
    # Get all categories first
    response = client.get("/api/v1/categories")
    categories = response.json()
    cat_id = categories[0]["id"]

    # Get products in category
    response = client.get(f"/api/v1/categories/{cat_id}/products")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)

    # Non-existent category
    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/categories/{random_uuid}/products")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found"

    # Invalid UUID format
    response = client.get("/api/v1/categories/invalid-uuid/products")
    assert response.status_code == 422


def test_products_filtering_and_sorting(client):
    # Filter by brand
    response = client.get("/api/v1/products?brand=Intel")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert "Intel" in item["brand"]

    # Filter by price range
    response = client.get("/api/v1/products?min_price=100&max_price=500")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert 100 <= item["price"] <= 500

    # Sort by price asc
    response = client.get("/api/v1/products?sort_by=price_asc")
    assert response.status_code == 200
    items = response.json()["items"]
    prices = [item["price"] for item in items]
    assert prices == sorted(prices)

    # Sort by price desc
    response = client.get("/api/v1/products?sort_by=price_desc")
    assert response.status_code == 200
    items = response.json()["items"]
    prices = [item["price"] for item in items]
    assert prices == sorted(prices, reverse=True)


def test_products_search(client):
    # Search by product name
    response = client.get("/api/v1/products?search=Ryzen")
    assert response.status_code == 200
    items = response.json()["items"]
    assert len(items) > 0
    for item in items:
        assert "Ryzen" in item["name"] or "Ryzen" in item["brand"]

    # Search by category name
    response = client.get("/api/v1/products?search=CPUs")
    assert response.status_code == 200
    items = response.json()["items"]
    assert len(items) > 0
