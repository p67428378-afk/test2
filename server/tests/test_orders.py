import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_orders_run.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_orders_run.db"):
        try:
            os.remove("test_orders_run.db")
        except Exception:
            pass


def test_place_order():
    # Create a book
    book_data = {
        "title": "Harry Potter and the Prisoner of Azkaban",
        "description": "The third book.",
        "price": 14.99,
        "isbn": "9780747542155",
        "cover_image_url": "http://example.com/cover3.jpg",
        "stock_quantity": 10,
        "format": "Paperback",
    }
    response = client.post("/api/v1/books", json=book_data)
    assert response.status_code == 201
    book_id = response.json()["id"]

    # Add to cart
    client.post(
        "/api/v1/cart",
        json={"book_id": book_id, "quantity": 2},
        headers={"X-Session-ID": "order_session"},
    )

    # Place order
    order_data = {
        "email": "harry@hogwarts.edu",
        "shipping_name": "Harry Potter",
        "shipping_address": "Gryffindor Dormitory, Hogwarts",
        "payment_token": "tok_visa",
    }
    response = client.post(
        "/api/v1/orders", json=order_data, headers={"X-Session-ID": "order_session"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Paid"
    assert response.json()["total_amount"] == 29.98

    # Verify stock decremented
    response = client.get(f"/api/v1/books/{book_id}")
    assert response.json()["stock_quantity"] == 8
