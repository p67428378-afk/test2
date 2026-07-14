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


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Instant Vehicle Damage Estimate API" in response.json()["message"]


def test_upload_no_files():
    response = client.post("/api/v1/claims/upload", files=[])
    assert response.status_code == 400


def test_upload_invalid_file_type():
    file_data = {"files": ("test.txt", b"some text content", "text/plain")}
    response = client.post("/api/v1/claims/upload", files=file_data)
    assert response.status_code == 400


def test_upload_and_poll_flow():
    # Upload valid images
    files = [
        ("files", ("front.jpg", b"fake_image_data_1", "image/jpeg")),
        ("files", ("side.jpg", b"fake_image_data_2", "image/png")),
    ]
    response = client.post("/api/v1/claims/upload", files=files)
    assert response.status_code == 202
    data = response.json()
    assert "claim_id" in data
    claim_id = data["claim_id"]

    # Poll the estimate endpoint
    poll_response = client.get(f"/api/v1/claims/{claim_id}/estimate")
    assert poll_response.status_code == 200
    poll_data = poll_response.json()
    assert poll_data["status"] in ["PROCESSING", "READY", "FAILED"]


def test_get_non_existent_claim():
    response = client.get(
        "/api/v1/claims/00000000-0000-0000-0000-000000000000/estimate"
    )
    assert response.status_code == 404


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
        "/api/v1/claims/dispatch/request_tow", json=payload, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "dispatch_id" in data
    assert data["status"] == "DISPATCHED"
    dispatch_id = data["dispatch_id"]

    # Request again with same idempotency key
    response_dup = client.post(
        "/api/v1/claims/dispatch/request_tow", json=payload, headers=headers
    )
    assert response_dup.status_code == 200
    assert response_dup.json()["dispatch_id"] == dispatch_id

    # Get dispatch status
    status_resp = client.get(f"/api/v1/claims/dispatch/{dispatch_id}/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "DISPATCHED"

    # Cancel dispatch
    cancel_resp = client.post(f"/api/v1/claims/dispatch/{dispatch_id}/cancel")
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "cancelled"

    # Try to cancel again or check status
    status_resp_2 = client.get(f"/api/v1/claims/dispatch/{dispatch_id}/status")
    assert status_resp_2.json()["status"] == "CANCELLED"
    db.close()


def test_active_incident():
    # No claims initially
    response = client.get("/api/v1/claims/active_incident")
    assert response.status_code == 200
    assert response.json()["isActiveIncident"] is False

    # Create a processing claim
    db = TestingSessionLocal()
    claim = Claim(policyholder_id=uuid.uuid4(), status="PROCESSING")
    db.add(claim)
    db.commit()
    db.refresh(claim)

    response = client.get("/api/v1/claims/active_incident")
    assert response.status_code == 200
    assert response.json()["isActiveIncident"] is True
    assert response.json()["claim"]["id"] == str(claim.id)
    db.close()


@pytest.mark.anyio
async def test_estimate_conflict_detection():
    # Create a claim with status READY, AI estimate total_cost = 1250.00
    db = TestingSessionLocal()
    claim = Claim(
        policyholder_id=uuid.uuid4(),
        status="READY",
        estimated_cost=1250.00,
        damage_breakdown={
            "total_cost": 1250.00,
            "currency": "USD",
            "breakdown": [
                {"part": "Front Bumper", "cost": 700.00},
                {"part": "Right Headlight", "cost": 550.00},
            ],
        },
        manual_amount=1500.00,
        has_conflict=True,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)

    response = client.get(f"/api/v1/claims/{claim.id}/estimate")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "READY"
    assert data["has_conflict"] is True
    assert data["manual_estimate_details"]["amount"] == 1500.00
    assert data["manual_estimate_details"]["currency"] == "USD"
    db.close()
