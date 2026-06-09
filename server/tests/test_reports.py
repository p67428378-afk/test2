import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_reports.db"
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
        if os.path.exists("test_reports.db"):
            try:
                os.remove("test_reports.db")
            except Exception:
                pass

def test_reports_metrics(db):
    client = TestClient(app)
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db

    # Create customer
    cust_resp = client.post("/api/v1/customers", json={"name": "Apex Construction"})
    customer_id = cust_resp.json()["customer_id"]

    # Create product
    prod_resp = client.post("/api/v1/inventory", json={
        "name": "Tempered Glass 12mm",
        "cost": 50.00,
        "price": 120.00,
        "stock_quantity": 5 # Low stock (< 10)
    })
    product_id = prod_resp.json()["product_id"]

    # Create order
    order_resp = client.post("/api/v1/orders", json={
        "customer_id": customer_id,
        "is_quote": False,
        "line_items": [
            {"product_id": product_id, "quantity": 1}
        ]
    })
    order_id = order_resp.json()["order_id"]

    # Get reports (active order should be 1, low stock should be 1, total revenue 0)
    rep_resp = client.get("/api/v1/reports")
    assert rep_resp.status_code == 200
    rep_data = rep_resp.json()
    assert rep_data["active_orders_count"] == 1
    assert rep_data["low_stock_count"] == 1
    assert float(rep_data["total_revenue"]) == 0.00

    # Complete the order
    client.put(f"/api/v1/orders/{order_id}", json={"status": "completed"})

    # Get reports again (active order should be 0, total revenue should be 120.00)
    rep_resp = client.get("/api/v1/reports")
    rep_data = rep_resp.json()
    assert rep_data["active_orders_count"] == 0
    assert float(rep_data["total_revenue"]) == 120.00
    assert len(rep_data["sales_history"]) >= 1
