import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_cart_run.db"
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
    if os.path.exists("test_cart_run.db"):
        try:
            os.remove("test_cart_run.db")
        except Exception:
            pass


def test_cart_operations():
    # Create a book first
    book_data = {
        "title": "Harry Potter and the Chamber of Secrets",
        "description": "The second book.",
        "price": 24.99,
        "isbn": "9780747538493",
        "cover_image_url": "http://example.com/cover2.jpg",
        "stock_quantity": 5,
        "format": "Hardcover",
    }
    response = client.post("/api/v1/books", json=book_data)
    assert response.status_code == 201
    book_id = response.json()["id"]

    # Get empty cart
    response = client.get("/api/v1/cart", headers={"X-Session-ID": "test_session"})
    assert response.status_code == 200
    assert response.json()["items"] == []
    assert response.json()["total_amount"] == 0.0

    # Add to cart
    response = client.post(
        "/api/v1/cart",
        json={"book_id": book_id, "quantity": 2},
        headers={"X-Session-ID": "test_session"},
    )
    assert response.status_code == 200
    assert response.json()["total_items"] == 2

    # Get cart with items
    response = client.get("/api/v1/cart", headers={"X-Session-ID": "test_session"})
    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
    assert response.json()["total_amount"] == 49.98

    # Remove from cart
    response = client.delete(
        f"/api/v1/cart/{book_id}", headers={"X-Session-ID": "test_session"}
    )
    assert response.status_code == 200
