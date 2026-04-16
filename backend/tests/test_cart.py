
import pytest
from backend.models import Product


@pytest.fixture(scope="function")
def populate_db(db_session):
    """
    Populate the database with initial data for tests.
    """
    product1 = Product(id=1, name="Test Product 1", price=10.0, stock=10)
    product2 = Product(id=2, name="Test Product 2", price=20.0, stock=5)
    db_session.add(product1)
    db_session.add(product2)
    db_session.commit()


def test_add_item_to_cart(client, populate_db):
    response = client.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 200
    assert response.json()["product_id"] == 1


def test_add_same_item_to_cart(client, populate_db):
    client.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    response = client.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 200
    assert response.json()["quantity"] == 2


def test_add_item_insufficient_stock(client, populate_db):
    response = client.post("/api/cart/add", json={"product_id": 2, "quantity": 100})
    assert response.status_code == 400
    assert response.json() == {"detail": "Insufficient stock"}


def test_get_cart(client, populate_db):
    client.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    response = client.get("/api/cart/")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[-1]["product_id"] == 1
    assert response.json()[-1]["quantity"] >= 1

