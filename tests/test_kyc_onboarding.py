
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from kyc_onboarding.main import app
from kyc_onboarding.db.database import get_db, Base
from kyc_onboarding.models.customer_kyc import CustomerKYC

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False
    },
    poolclass=StaticPool, # Use StaticPool for in-memory SQLite
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

# Override the get_db dependency for testing
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_customer_kyc_model(db_session):
    customer_kyc = CustomerKYC(
        customer_id="test_customer_123",
        aadhaar_number="123456789012",
        pan_number="ABCDE1234F",
        aadhaar_validation_status="PENDING",
        pan_validation_status="PENDING",
        sanctions_screening_status="PENDING",
        final_kyc_status="PENDING",
    )
    db_session.add(customer_kyc)
    db_session.commit()
    db_session.refresh(customer_kyc)

    assert customer_kyc.customer_id == "test_customer_123"
    assert customer_kyc.aadhaar_number == "123456789012"
    assert customer_kyc.pan_number == "ABCDE1234F"
    assert customer_kyc.final_kyc_status == "PENDING"

def test_onboard_customer_kyc_api():
    response = client.post(
        "/kyc/onboard",
        json={
            "customer_id": "api_customer_456",
            "aadhaar_number": "987654321098",
            "pan_number": "FGHIJ5678K"
        }
    )
    assert response.status_code == 202
    data = response.json()
    assert "kyc_id" in data
    assert data["customer_id"] == "api_customer_456"
    assert data["final_kyc_status"] == "PENDING"
    assert data["message"] == "KYC processing initiated. Check status later."

def test_get_customer_kyc_status_api():
    # First, onboard a customer to get a kyc_id
    onboard_response = client.post(
        "/kyc/onboard",
        json={
            "customer_id": "get_customer_789",
            "aadhaar_number": "112233445566",
            "pan_number": "KLMNO1234P"
        }
    )
    assert onboard_response.status_code == 202
    kyc_id = onboard_response.json()["kyc_id"]

    # Then, retrieve the status
    get_response = client.get(f"/kyc/{kyc_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["kyc_id"] == kyc_id
    assert data["customer_id"] == "get_customer_789"
    assert data["aadhaar_number"] == "112233445566"
    assert data["pan_number"] == "KLMNO1234P"
    assert data["final_kyc_status"] == "PENDING"
    assert "audit_trails" in data # Check for audit_trails field

def test_get_nonexistent_customer_kyc_status_api():
    response = client.get("/kyc/nonexistent-kyc-id")
    assert response.status_code == 404
    assert response.json() == {"detail": "KYC record not found"}
