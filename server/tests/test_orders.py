import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_orders.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)
        if os.path.exists("test_orders.db"):
            try:
                os.remove("test_orders.db")
            except Exception:
                pass

def test_create_quote_and_order(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # 1. Create Customer
    cust_resp = client.post("/api/v1/customers", json={"name": "Apex Construction", "contact_info": "apex@example.com"})
    customer_id = cust_resp.json()["customer_id"]

    # 2. Create Product
    prod_resp = client.post("/api/v1/inventory", json={
        "name": "Tempered Glass 12mm",
        "cost": 50.00,
        "price": 120.00,
        "stock_quantity": 10
    })
    product_id = prod_resp.json()["product_id"]

    # 3. Create Quote
    quote_resp = client.post("/api/v1/orders", json={
        "customer_id": customer_id,
        "is_quote": True,
        "line_items": [
            {"product_id": product_id, "quantity": 2, "height": 2.0, "width": 1.5}
        ]
    })
    assert quote_resp.status_code == 201
    quote_data = quote_resp.json()
    assert quote_data["quote_id"] is not None
    assert quote_data["status"] == "draft"
    assert float(quote_data["total_price"]) == 240.00

    # 4. Create Order (with stock check)
    order_resp = client.post("/api/v1/orders", json={
        "customer_id": customer_id,
        "is_quote": False,
        "line_items": [
            {"product_id": product_id, "quantity": 3}
        ]
    })
    assert order_resp.status_code == 201
    order_data = order_resp.json()
    assert order_data["order_id"] is not None
    assert order_data["status"] == "pending"
    assert float(order_data["total_price"]) == 360.00

    # Verify stock decremented (10 - 3 = 7)
    prod_check = client.get("/api/v1/inventory")
    assert prod_check.json()["items"][0]["stock_quantity"] == 7

def test_insufficient_stock(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    cust_resp = client.post("/api/v1/customers", json={"name": "Apex Construction"})
    customer_id = cust_resp.json()["customer_id"]

    prod_resp = client.post("/api/v1/inventory", json={
        "name": "Tempered Glass 12mm",
        "cost": 50.00,
        "price": 120.00,
        "stock_quantity": 2
    })
    product_id = prod_resp.json()["product_id"]

    # Try to order 5 (only 2 in stock)
    order_resp = client.post("/api/v1/orders", json={
        "customer_id": customer_id,
        "is_quote": False,
        "line_items": [
            {"product_id": product_id, "quantity": 5}
        ]
    })
    assert order_resp.status_code == 400
    assert "Insufficient stock" in order_resp.json()["detail"]
