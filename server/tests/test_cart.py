import pytest
from server.database import SessionLocal
from server.models import User, Product
import json


@pytest.fixture(scope="function")
def client_and_auth(client):
    db = SessionLocal()
    # Ensure we have a user and a product
    user = db.query(User).filter(User.email == "cart_test@example.com").first()
    if not user:
        from server.auth import get_password_hash

        user = User(
            email="cart_test@example.com", password_hash=get_password_hash("password")
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    product = db.query(Product).first()
    if not product:
        product = Product(
            name="Dino-Adventure Bento",
            description="Fun dinosaur themed bento box for kids.",
            price=24.99,
            image_urls=json.dumps(
                [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAB-aVGQjrhFa8QDi5q-F4R6NgvgfBLusbWla6Ob8AxhOjvC3GwdXTWVj7o_NvszX49apD7875V9zDmZi_VNhNaIIiI-s7b88jS8UaNKAD67JAuipzzvRgcmHJZkXLssXGa4oRiKyC4IC2ki3tG7vDgFHsOj9YYVwdl3zUeM0IuDlkaCqEVllDfZ2PngLvpopJdOn5fUCR01a0221eDKvO62oVTBgUL97pIGibKb-Bh5AZvHezFD8nHJrRA6kWU4f5RVIvUpfOVS7wy"
                ]
            ),
            category="Kids",
            rating=4.9,
            review_count=124,
            tags=json.dumps(["Kids", "Leakproof"]),
        )
        db.add(product)
        db.commit()
        db.refresh(product)

    product_id = str(product.product_id)
    db.close()

    # Login to get token
    login_resp = client.post(
        "/api/v1/users/login",
        json={"email": "cart_test@example.com", "password": "password"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    yield client, headers, product_id


def test_get_cart_empty(client_and_auth):
    client, headers, _ = client_and_auth
    response = client.get("/api/v1/cart", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "cart_id" in data
    assert data["items"] == []
    assert data["subtotal"] == 0.0


def test_add_to_cart(client_and_auth):
    client, headers, product_id = client_and_auth
    response = client.post(
        "/api/v1/cart", headers=headers, json={"product_id": product_id, "quantity": 2}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["product_id"] == product_id
    assert data["items"][0]["quantity"] == 2
    assert data["subtotal"] > 0.0


def test_update_cart_quantity(client_and_auth):
    client, headers, product_id = client_and_auth
    response = client.post(
        "/api/v1/cart", headers=headers, json={"product_id": product_id, "quantity": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["quantity"] == 5


def test_remove_from_cart(client_and_auth):
    client, headers, product_id = client_and_auth
    response = client.post(
        "/api/v1/cart", headers=headers, json={"product_id": product_id, "quantity": 0}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 0
    assert data["subtotal"] == 0.0
