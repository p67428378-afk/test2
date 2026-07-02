import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
from decimal import Decimal

from server.database import Base, get_db
from server.main import app
from server.models import Customer, Account, FDProduct

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    # Drop and recreate tables to ensure a clean state for each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed initial test data
    customer = Customer(
        id="99999999-9999-9999-9999-999999999999",
        name="Test User",
        email="test@example.com",
    )
    db.add(customer)

    account = Account(
        id="88888888-8888-8888-8888-888888888888",
        customer_id=customer.id,
        account_number="SAV-123456",
        balance=Decimal("10000.00"),
        currency="USD",
        account_type="SAVINGS",
    )
    db.add(account)

    product = FDProduct(
        id="11111111-1111-1111-1111-111111111111",
        name="Short Term Saver",
        tenure_months=6,
        interest_rate=Decimal("4.50"),
        min_deposit=Decimal("1000.00"),
        badge="Popular",
    )
    db.add(product)

    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


def test_list_fd_products():
    response = client.get("/api/v1/fd-products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert len(data["products"]) >= 1
    assert data["products"][0]["name"] == "Short Term Saver"


def test_get_account_success():
    response = client.get("/api/v1/accounts/88888888-8888-8888-8888-888888888888")
    assert response.status_code == 200
    data = response.json()
    assert data["account_number"] == "SAV-123456"
    assert data["balance"] == 10000.00


def test_get_account_not_found():
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/accounts/{random_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Account not found"


def test_create_fd_success():
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "source_account_id": "88888888-8888-8888-8888-888888888888",
        "deposit_amount": 5000.00,
        "pin": "1234",
    }
    response = client.post("/api/v1/fds", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ACTIVE"
    assert data["principal_amount"] == 5000.00
    assert data["interest_rate"] == 4.50
    assert data["tenure_months"] == 6
    assert "maturity_amount" in data
    assert "maturity_date" in data

    # Verify source account balance is deducted
    acc_response = client.get("/api/v1/accounts/88888888-8888-8888-8888-888888888888")
    assert acc_response.json()["balance"] == 5000.00


def test_create_fd_invalid_pin():
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "source_account_id": "88888888-8888-8888-8888-888888888888",
        "deposit_amount": 5000.00,
        "pin": "9999",
    }
    response = client.post("/api/v1/fds", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid PIN"


def test_create_fd_insufficient_funds():
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "source_account_id": "88888888-8888-8888-8888-888888888888",
        "deposit_amount": 15000.00,
        "pin": "1234",
    }
    response = client.post("/api/v1/fds", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient funds in source account"


def test_create_fd_below_minimum():
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "source_account_id": "88888888-8888-8888-8888-888888888888",
        "deposit_amount": 500.00,
        "pin": "1234",
    }
    response = client.post("/api/v1/fds", json=payload)
    assert response.status_code == 400
    assert "below the minimum required" in response.json()["detail"]
