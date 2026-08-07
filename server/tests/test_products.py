from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def get_auth_headers(
    client: TestClient, email: str = "test@example.com", password: str = "testpassword"
):
    # Login to get token
    response = client.post(
        "/api/v1/sellers/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_product(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create product
    response = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7-13700H",
            "ram": "16GB DDR5",
            "storage": "512GB NVMe SSD",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch WUXGA",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["brand"] == "Lenovo"
    assert data["model"] == "ThinkPad X1 Carbon"
    assert data["price"] == 1399.00
    assert data["stock_quantity"] == 15
    assert data["is_low_stock"] is False

    # Create product with negative price (should fail)
    response_neg_price = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7-13700H",
            "ram": "16GB DDR5",
            "storage": "512GB NVMe SSD",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch WUXGA",
            "condition": "New",
            "price": -10.00,
            "stock_quantity": 15,
        },
    )
    assert response_neg_price.status_code == 422

    # Create product with invalid condition (should fail)
    response_invalid_cond = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7-13700H",
            "ram": "16GB DDR5",
            "storage": "512GB NVMe SSD",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch WUXGA",
            "condition": "SuperNew",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    assert response_invalid_cond.status_code == 422


def test_list_products_filtering(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create a few products
    client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Apple",
            "model": "MacBook Pro 14",
            "processor": "M2 Pro",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Apple GPU",
            "screen_size": "14.2 inch",
            "condition": "New",
            "price": 1999.00,
            "stock_quantity": 2,
        },
    )
    client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Dell",
            "model": "XPS 13",
            "processor": "Intel Core i5",
            "ram": "8GB",
            "storage": "256GB",
            "gpu": "Intel UHD",
            "screen_size": "13.4 inch",
            "condition": "Refurbished",
            "price": 899.00,
            "stock_quantity": 0,
        },
    )

    # Test list all
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3

    # Test filter by brand
    response_brand = client.get("/api/v1/products?brand=Apple")
    assert response_brand.status_code == 200
    data_brand = response_brand.json()
    assert data_brand["total"] == 1
    assert data_brand["items"][0]["brand"] == "Apple"

    # Test filter by condition
    response_cond = client.get("/api/v1/products?condition=Refurbished")
    assert response_cond.status_code == 200
    data_cond = response_cond.json()
    assert data_cond["total"] == 1
    assert data_cond["items"][0]["condition"] == "Refurbished"

    # Test filter by price range
    response_price = client.get("/api/v1/products?min_price=1000&max_price=1500")
    assert response_price.status_code == 200
    data_price = response_price.json()
    assert data_price["total"] == 1
    assert data_price["items"][0]["brand"] == "Lenovo"

    # Test search
    response_search = client.get("/api/v1/products?search=XPS")
    assert response_search.status_code == 200
    data_search = response_search.json()
    assert data_search["total"] == 1
    assert data_search["items"][0]["model"] == "XPS 13"


def test_get_product_by_id(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create product
    res = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    product_id = res.json()["id"]

    # Get product
    response = client.get(f"/api/v1/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["id"] == product_id

    # Get non-existent product
    response_not_found = client.get("/api/v1/products/non-existent-id")
    assert response_not_found.status_code == 404


def test_update_product(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create product
    res = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    product_id = res.json()["id"]

    # Update product
    response = client.put(
        f"/api/v1/products/{product_id}",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon Gen 11",
            "processor": "Intel Core i7-13700H",
            "ram": "32GB DDR5",
            "storage": "1TB NVMe SSD",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch WUXGA",
            "condition": "New",
            "price": 1599.00,
            "stock_quantity": 10,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "ThinkPad X1 Carbon Gen 11"
    assert data["ram"] == "32GB DDR5"
    assert data["price"] == 1599.00
    assert data["stock_quantity"] == 10


def test_delete_product(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create product
    res = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 15,
        },
    )
    product_id = res.json()["id"]

    # Delete product
    response = client.delete(f"/api/v1/products/{product_id}", headers=headers)
    assert response.status_code == 204

    # Verify deleted
    response_get = client.get(f"/api/v1/products/{product_id}")
    assert response_get.status_code == 404


def test_low_stock_and_negative_stock(client: TestClient, db: Session):
    headers = get_auth_headers(client)

    # Create product with low stock (2 units)
    response = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 2,
        },
    )
    assert response.status_code == 201
    assert response.json()["is_low_stock"] is True

    # Create product with normal stock (5 units)
    response2 = client.post(
        "/api/v1/products",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": 5,
        },
    )
    assert response2.status_code == 201
    assert response2.json()["is_low_stock"] is False

    # Try to update stock to negative value (should fail)
    product_id = response2.json()["id"]
    response_update = client.put(
        f"/api/v1/products/{product_id}",
        headers=headers,
        json={
            "brand": "Lenovo",
            "model": "ThinkPad X1 Carbon",
            "processor": "Intel Core i7",
            "ram": "16GB",
            "storage": "512GB",
            "gpu": "Intel Iris Xe",
            "screen_size": "14.0 inch",
            "condition": "New",
            "price": 1399.00,
            "stock_quantity": -1,
        },
    )
    assert response_update.status_code == 422
