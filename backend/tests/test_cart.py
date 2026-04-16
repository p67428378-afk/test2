
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app, get_db
from backend.database import Base
from backend.models import Product

# 1. Define a test-specific database URL and engine
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

# 2. Create an engine with StaticPool to ensure a single connection is shared
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# 3. Create a test-specific session factory
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_and_teardown_database():
    # Create tables using the test engine
    Base.metadata.create_all(bind=engine)

    # Override the application's get_db dependency to use the test session
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Populate the database with initial data for tests
    db = TestingSessionLocal()
    try:
        product1 = Product(id=1, name="Test Product 1", price=10.0, stock=10)
        product2 = Product(id=2, name="Test Product 2", price=20.0, stock=5)
        db.add(product1)
        db.add(product2)
        db.commit()
    finally:
        db.close()

    yield

    # After the test is finished, drop all tables to ensure a clean state
    Base.metadata.drop_all(bind=engine)


@pytest.mark.asyncio
async def test_add_item_to_cart():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 200
    assert response.json()["product_id"] == 1

@pytest.mark.asyncio
async def test_add_same_item_to_cart():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        await ac.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
        response = await ac.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 200
    assert response.json()["quantity"] == 2

@pytest.mark.asyncio
async def test_add_item_insufficient_stock():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/cart/add", json={"product_id": 2, "quantity": 100})
    assert response.status_code == 400
    assert response.json() == {"detail": "Insufficient stock"}

@pytest.mark.asyncio
async def test_get_cart():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        await ac.post("/api/cart/add", json={"product_id": 1, "quantity": 1})
        response = await ac.get("/api/cart/")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[-1]["product_id"] == 1
    assert response.json()[-1]["quantity"] >= 1
