import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

from server.main import app
from server.database import Base, get_db
from server.models import User
from server.models.wishlist import Product
from server.routers.wishlist import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_wishlist.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Recreate tables for wishlist tests
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create tables and seed initial data
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    # Seed a test user
    hashed_password = get_password_hash("testpassword")
    user = User(
        id=uuid4(),
        login_id="test@example.com",
        mobile_number="1234567890",
        hashed_password=hashed_password,
        security_question="What is your favorite color?",
        security_answer_hash=get_password_hash("blue"),
    )
    db.add(user)

    # Seed a test product
    product = Product(
        id=uuid4(),
        name="AeroSound Max Wireless Headphones",
        description="Experience industry-leading noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups.",
        price=299.00,
        image_url="https://example.com/image.png",
    )
    db.add(product)
    db.commit()
    db.close()
    yield


def test_auth_flow():
    # Test registration
    reg_response = client.post(
        "/api/v1/auth/register?login_id=newuser@example.com&mobile_number=0987654321&password=newpassword"
    )
    assert reg_response.status_code == 201
    assert "user_id" in reg_response.json()

    # Test login
    login_response = client.post(
        "/api/v1/auth/login?login_id=newuser@example.com&password=newpassword"
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()


def test_wishlist_unauthorized():
    # Try to get wishlist without token
    response = client.get("/api/v1/wishlist")
    assert response.status_code == 401

    # Try to add item without token
    response = client.post("/api/v1/wishlist/items", json={"product_id": str(uuid4())})
    assert response.status_code == 401


def test_wishlist_crud_flow():
    # Login to get token
    login_response = client.post(
        "/api/v1/auth/login?login_id=test@example.com&password=testpassword"
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get product ID from database
    db = TestingSessionLocal()
    product = db.query(Product).first()
    product_id = str(product.id)
    db.close()

    # Add product to wishlist
    add_response = client.post(
        "/api/v1/wishlist/items", json={"product_id": product_id}, headers=headers
    )
    assert add_response.status_code == 201
    wishlist_item_id = add_response.json()["id"]
    assert add_response.json()["product_id"] == product_id

    # Try to add duplicate product to wishlist (should fail with 409)
    dup_response = client.post(
        "/api/v1/wishlist/items", json={"product_id": product_id}, headers=headers
    )
    assert dup_response.status_code == 409

    # Try to add non-existent product (should fail with 404)
    fake_product_id = str(uuid4())
    not_found_response = client.post(
        "/api/v1/wishlist/items", json={"product_id": fake_product_id}, headers=headers
    )
    assert not_found_response.status_code == 404

    # Get wishlist
    get_response = client.get("/api/v1/wishlist", headers=headers)
    assert get_response.status_code == 200
    items = get_response.json()
    assert len(items) == 1
    assert items[0]["id"] == wishlist_item_id
    assert items[0]["product"]["id"] == product_id
    assert items[0]["product"]["name"] == "AeroSound Max Wireless Headphones"

    # Delete item from wishlist
    delete_response = client.delete(
        f"/api/v1/wishlist/items/{wishlist_item_id}", headers=headers
    )
    assert delete_response.status_code == 204

    # Verify wishlist is empty
    get_response_empty = client.get("/api/v1/wishlist", headers=headers)
    assert get_response_empty.status_code == 200
    assert len(get_response_empty.json()) == 0

    # Try to delete non-existent item (should fail with 404)
    delete_fake_response = client.delete(
        f"/api/v1/wishlist/items/{wishlist_item_id}", headers=headers
    )
    assert delete_fake_response.status_code == 404
