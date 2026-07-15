import pytest
from fastapi.testclient import TestClient
import uuid

from server.database import Base, engine, SessionLocal
from server.main import app
from server import schemas, crud


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    # Create tables on the actual engine used by the app
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed initial products
    products_to_seed = [
        schemas.ProductCreate(
            name="Fresh Atlantic Salmon Fillet",
            price=19.99,
            image_url="http://example.com/salmon.jpg",
            stock_quantity=10,
        ),
        schemas.ProductCreate(
            name="Wild-Caught Pacific Cod Fillet",
            price=14.99,
            image_url="http://example.com/cod.jpg",
            stock_quantity=5,
        ),
        schemas.ProductCreate(
            name="Jumbo Tiger Prawns",
            price=24.99,
            image_url="http://example.com/prawns.jpg",
            stock_quantity=15,
        ),
        schemas.ProductCreate(
            name="Whole Red Snapper",
            price=22.50,
            image_url="http://example.com/snapper.jpg",
            stock_quantity=0,
        ),  # Out of stock
    ]
    for p in products_to_seed:
        crud.create_product(db, p)

    yield db

    # Drop tables
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(setup_db):
    with TestClient(app) as c:
        yield c


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to the Ocean Catch Fish Shop API" in response.json()["message"]


def test_list_products(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    assert data[0]["name"] == "Fresh Atlantic Salmon Fillet"
    assert data[3]["stock_quantity"] == 0


def test_get_product(client):
    # Get all products first to find an ID
    response = client.get("/api/v1/products")
    products = response.json()
    product_id = products[0]["id"]

    response = client.get(f"/api/v1/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Fresh Atlantic Salmon Fillet"


def test_get_product_not_found(client):
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/products/{random_id}")
    assert response.status_code == 404


def test_cart_lifecycle(client):
    # 1. Create cart
    response = client.post("/api/v1/cart")
    assert response.status_code == 200
    cart_data = response.json()
    cart_id = cart_data["cart_id"]
    assert cart_data["items"] == []
    assert cart_data["total_price"] == 0.0

    # Get products to add
    prod_resp = client.get("/api/v1/products")
    products = prod_resp.json()
    salmon = products[0]
    cod = products[1]
    snapper = products[3]  # Out of stock

    # 2. Add item to cart
    response = client.post(
        f"/api/v1/cart/{cart_id}/items",
        json={"product_id": salmon["id"], "quantity": 2},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["product_id"] == salmon["id"]
    assert data["items"][0]["quantity"] == 2
    assert data["total_price"] == salmon["price"] * 2

    # 3. Add more of same item
    response = client.post(
        f"/api/v1/cart/{cart_id}/items",
        json={"product_id": salmon["id"], "quantity": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["quantity"] == 3

    # 4. Add item exceeding stock
    response = client.post(
        f"/api/v1/cart/{cart_id}/items", json={"product_id": cod["id"], "quantity": 10}
    )
    assert response.status_code == 400
    assert "exceeds available stock" in response.json()["detail"]

    # 5. Add out of stock item
    response = client.post(
        f"/api/v1/cart/{cart_id}/items",
        json={"product_id": snapper["id"], "quantity": 1},
    )
    assert response.status_code == 400

    # 6. Remove item from cart
    response = client.delete(f"/api/v1/cart/{cart_id}/items/{salmon['id']}")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 0


def test_checkout_process(client):
    # Create cart
    cart_resp = client.post("/api/v1/cart")
    cart_id = cart_resp.json()["cart_id"]

    # Get product
    prod_resp = client.get("/api/v1/products")
    salmon = prod_resp.json()[0]

    # Add to cart
    client.post(
        f"/api/v1/cart/{cart_id}/items",
        json={"product_id": salmon["id"], "quantity": 2},
    )

    # Checkout payload
    checkout_payload = {
        "cart_id": cart_id,
        "shipping_address": {
            "name": "John Doe",
            "email": "john@example.com",
            "address": "123 Ocean Way",
            "city": "Seaside",
            "state": "CA",
            "zip": "93955",
        },
        "payment_details": {
            "card_number": "1234 5678 1234 5678",
            "cardholder_name": "John Doe",
            "expiry": "12/28",
            "cvc": "123",
        },
    }

    # Submit order
    response = client.post("/api/v1/orders", json=checkout_payload)
    assert response.status_code == 200
    order_data = response.json()
    assert "order_id" in order_data
    assert order_data["total_price"] == salmon["price"] * 2
    assert order_data["payment_status"] == "completed"

    # Verify stock was deducted
    prod_detail = client.get(f"/api/v1/products/{salmon['id']}")
    assert prod_detail.json()["stock_quantity"] == 8


def test_checkout_payment_failure(client):
    # Create cart
    cart_resp = client.post("/api/v1/cart")
    cart_id = cart_resp.json()["cart_id"]

    # Get product
    prod_resp = client.get("/api/v1/products")
    salmon = prod_resp.json()[0]

    # Add to cart
    client.post(
        f"/api/v1/cart/{cart_id}/items",
        json={"product_id": salmon["id"], "quantity": 2},
    )

    # Checkout payload with failing card (starts with 4111)
    checkout_payload = {
        "cart_id": cart_id,
        "shipping_address": {
            "name": "John Doe",
            "email": "john@example.com",
            "address": "123 Ocean Way",
            "city": "Seaside",
            "state": "CA",
            "zip": "93955",
        },
        "payment_details": {
            "card_number": "4111 1111 1111 1111",
            "cardholder_name": "John Doe",
            "expiry": "12/28",
            "cvc": "123",
        },
    }

    # Submit order
    response = client.post("/api/v1/orders", json=checkout_payload)
    assert response.status_code == 400
    assert "Payment failed" in response.json()["detail"]
