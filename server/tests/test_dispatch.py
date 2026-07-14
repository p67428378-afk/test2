import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid
import os

# Set TESTING environment variable
os.environ["TESTING"] = "true"

from server.main import app
from server.database import Base, get_db
from server.models import Claim

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    # Override dependency
    app.dependency_overrides[get_db] = override_get_db
    # Import models to ensure they are registered on Base
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


client = TestClient(app)


def test_dispatch_flow_and_idempotency():
    # Create a claim first
    db = TestingSessionLocal()
    claim = Claim(policyholder_id=uuid.uuid4(), status="READY")
    db.add(claim)
    db.commit()
    db.refresh(claim)

    # Request tow truck
    payload = {
        "claim_id": str(claim.id),
        "gps_latitude": 37.7749,
        "gps_longitude": -122.4194,
    }
    headers = {"Idempotency-Key": "test-key-123"}

    response = client.post(
        "/api/v1/dispatch/request_tow", json=payload, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "dispatch_id" in data
    assert data["status"] == "DISPATCHED"
    dispatch_id = data["dispatch_id"]

    # Request again with same idempotency key
    response_dup = client.post(
        "/api/v1/dispatch/request_tow", json=payload, headers=headers
    )
    assert response_dup.status_code == 200
    assert response_dup.json()["dispatch_id"] == dispatch_id

    # Get dispatch status
    status_resp = client.get(f"/api/v1/dispatch/{dispatch_id}/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "DISPATCHED"

    # Cancel dispatch
    cancel_resp = client.post(f"/api/v1/dispatch/{dispatch_id}/cancel")
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "cancelled"

    # Try to cancel again or check status
    status_resp_2 = client.get(f"/api/v1/dispatch/{dispatch_id}/status")
    assert status_resp_2.json()["status"] == "CANCELLED"
    db.close()
