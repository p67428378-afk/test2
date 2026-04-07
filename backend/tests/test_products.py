from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.app import models

def test_create_product(client: TestClient):
    response = client.post(
        "/api/v1/products/",
        json={
            "name": "Gold Card",
            "description": "Premium credit card with exclusive benefits.",
            "apr": 18.99,
            "annual_charges": 99.00,
            "credit_limit_min": 5000.00,
            "credit_limit_max": 20000.00,
            "rewards_description": "2% cashback on all purchases",
            "is_active": True
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Gold Card"
    assert "product_id" in data

def test_read_products(client: TestClient, db_session: Session):
    # Create a product directly in the database for testing read functionality
    product_data = models.CreditCardProduct(
        name="Silver Card",
        description="Standard credit card.",
        apr=20.50,
        annual_charges=0.00,
        credit_limit_min=1000.00,
        credit_limit_max=5000.00,
        rewards_description="1% cashback",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(product["name"] == "Silver Card" for product in data)

def test_read_single_product(client: TestClient, db_session: Session):
    product_data = models.CreditCardProduct(
        name="Bronze Card",
        description="Basic credit card.",
        apr=22.00,
        annual_charges=0.00,
        credit_limit_min=500.00,
        credit_limit_max=2000.00,
        rewards_description="No rewards",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    response = client.get(f"/api/v1/products/{product_data.product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Bronze Card"
    assert data["product_id"] == product_data.product_id

def test_read_nonexistent_product(client: TestClient):
    response = client.get("/api/v1/products/nonexistent_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}

def test_update_product(client: TestClient, db_session: Session):
    product_data = models.CreditCardProduct(
        name="Update Test Card",
        description="Original description.",
        apr=15.00,
        annual_charges=10.00,
        credit_limit_min=100.00,
        credit_limit_max=1000.00,
        rewards_description="Basic rewards",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    update_payload = {"description": "Updated description.", "annual_charges": 50.00}
    response = client.put(f"/api/v1/products/{product_data.product_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Updated description."
    assert data["annual_charges"] == 50.00

def test_delete_product(client: TestClient, db_session: Session):
    product_data = models.CreditCardProduct(
        name="Delete Test Card",
        description="To be deleted.",
        apr=10.00,
        annual_charges=0.00,
        credit_limit_min=10.00,
        credit_limit_max=100.00,
        rewards_description="None",
        is_active=True
    )
    db_session.add(product_data)
    db_session.commit()
    db_session.refresh(product_data)

    response = client.delete(f"/api/v1/products/{product_data.product_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Product deleted successfully"}

    # Verify it's actually deleted
    response = client.get(f"/api/v1/products/{product_data.product_id}")
    assert response.status_code == 404
