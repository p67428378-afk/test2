import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import get_db
from server.models.topup_application import Base
from server.core.config import settings

# Set TESTING to True
settings.TESTING = True

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    """
    Create a new TestClient for each test function.
    """
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)


def test_create_topup_application_pre_approved(client):
    response = client.post("/api/v1/topup-applications", json={"loan_account_number": "HL123456789"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PRE-APPROVED"
    assert data["eligible_amount"] == 50000.0
    assert data["reason"] is None

def test_create_topup_application_ineligible_ltv(client):
    response = client.post("/api/v1/topup-applications", json={"loan_account_number": "HL987654321"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "INELIGIBLE"
    assert data["eligible_amount"] is None
    assert data["reason"] == "Current outstanding exceeds LTV limit."

def test_create_topup_application_ineligible_repayment(client):
    response = client.post("/api/v1/topup-applications", json={"loan_account_number": "HL111222333"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "INELIGIBLE"
    assert data["eligible_amount"] is None
    assert data["reason"] == "Poor repayment track record"

def test_create_topup_application_not_found(client):
    response = client.post("/api/v1/topup-applications", json={"loan_account_number": "HL000000000"})
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Loan account not found"
