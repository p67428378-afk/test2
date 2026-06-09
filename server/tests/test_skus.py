
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.models.sku_performance import SkuPerformance
from server.models.product import Product
from datetime import date

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Add a product first
    product = Product(sku="12345", name="Test Product")
    db.add(product)
    db.commit()
    db.refresh(product)

    sku_data = SkuPerformance(product_id=product.id, sales=1000, profit_margin=25, inventory_level=50, status_badge="GROW", calculation_date=date.today())
    db.add(sku_data)
    db.commit()
    db.refresh(sku_data)
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_read_skus(db_session):
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data["skus"]) == 1
    assert data["skus"][0]["sales"] == 1000
    assert data["skus"][0]["status_badge"] == "GROW"

def test_read_skus_with_filter(db_session):
    response = client.get("/api/v1/skus?filter_by_status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert len(data["skus"]) == 1

    response = client.get("/api/v1/skus?filter_by_status=REDUCE")
    assert response.status_code == 200
    data = response.json()
    assert len(data["skus"]) == 0

def test_read_skus_with_sort(db_session):
    response = client.get("/api/v1/skus?sort_by=profit_margin")
    assert response.status_code == 200
    data = response.json()
    assert len(data["skus"]) == 1
