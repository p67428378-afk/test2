from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app import models

def test_create_product(client: TestClient):
    response = client.post(
        "/products/",
        json={
            "name": "Gold Card",
            "description": "Premium credit card",
            "apr": 18.99,
            "annual_charges": 99.0,
            "credit_limit_min": 5000.0,
            "credit_limit_max": 20000.0,
            "rewards_description": "2% cashback",
            "is_active": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Gold Card"
    assert "product_id" in data

def test_read_products(client: TestClient, db_session: Session):
    product1 = models.CreditCardProduct(
        name="Silver Card",
        description="Basic credit card",
        apr=20.0,
        annual_charges=0.0,
        credit_limit_min=1000.0,
        credit_limit_max=5000.0,
        rewards_description="1% cashback",
        is_active=True,
    )
    db_session.add(product1)
    db_session.commit()

    response = client.get("/products/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert any(p["name"] == "Silver Card" for p in response.json())

def test_read_single_product(client: TestClient, db_session: Session):
    product = models.CreditCardProduct(
        name="Platinum Card",
        description="Exclusive credit card",
        apr=15.0,
        annual_charges=199.0,
        credit_limit_min=10000.0,
        credit_limit_max=50000.0,
        rewards_description="Travel rewards",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    response = client.get(f"/products/{product.product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Platinum Card"
    assert data["product_id"] == product.product_id

def test_read_nonexistent_product(client: TestClient):
    response = client.get("/products/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}
