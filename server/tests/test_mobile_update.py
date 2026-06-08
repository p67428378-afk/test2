import pytest
import hashlib
import uuid
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models, crud

# Use file-based SQLite for testing to persist across connections
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency
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
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Clean up existing data to avoid conflicts
    db.query(models.OTPVerification).delete()
    db.query(models.MobileUpdateRequest).delete()
    db.query(models.User).delete()
    db.commit()
    
    # Seed a test user
    test_user = models.User(
        login_id="testuser123",
        mobile_number="9876543210",
        hashed_password="hashed_password_here",
        security_question="What is your pet's name?",
        security_answer_hash="hashed_answer_here",
        account_number="123456789012" # 12-digit account number
    )
    db.add(test_user)
    db.commit()
    db.close()
    
    yield
    
    # Clean up after test
    db = TestingSessionLocal()
    db.query(models.OTPVerification).delete()
    db.query(models.MobileUpdateRequest).delete()
    db.query(models.User).delete()
    db.commit()
    db.close()

def hash_string(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def test_successful_mobile_update_flow():
    # 1. Initiate mobile update
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9998887776"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "OTP sent to old mobile number"
    assert "request_id" in data
    assert data["status"] == "PENDING_OLD_OTP"
    
    request_id = data["request_id"]
    request_uuid = uuid.UUID(request_id)

    # 2. Retrieve the generated OTP from the test database
    db = TestingSessionLocal()
    otp_verification = db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_uuid,
        models.OTPVerification.mobile_number_type == "OLD"
    ).first()
    assert otp_verification is not None
    
    # Brute-force the 6-digit OTP
    otp_code = None
    for i in range(100000, 1000000):
        if hash_string(str(i)) == otp_verification.otp_hash:
            otp_code = str(i)
            break
    
    assert otp_code is not None
    db.close()

    # 3. Verify old OTP
    response = client.post(
        "/api/v1/mobile-update/verify-old-otp",
        json={"otp": otp_code, "request_id": request_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Old mobile OTP verified. OTP sent to new mobile number"
    assert data["status"] == "PENDING_NEW_OTP"

    # 4. Retrieve the new OTP from the test database
    db = TestingSessionLocal()
    otp_verification_new = db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_uuid,
        models.OTPVerification.mobile_number_type == "NEW"
    ).first()
    assert otp_verification_new is not None
    
    otp_code_new = None
    for i in range(100000, 1000000):
        if hash_string(str(i)) == otp_verification_new.otp_hash:
            otp_code_new = str(i)
            break
            
    assert otp_code_new is not None
    db.close()

    # 5. Verify new OTP
    response = client.post(
        "/api/v1/mobile-update/verify-new-otp",
        json={"otp": otp_code_new, "request_id": request_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Mobile number updated successfully in CBS and CKYC"
    assert data["status"] == "COMPLETED"

    # 6. Check status
    response = client.get(f"/api/v1/mobile-update/status/{request_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert data["account_number"] == "123456789012"

    # 7. Verify user's mobile number is updated in the database
    db = TestingSessionLocal()
    user = db.query(models.User).filter(models.User.account_number == "123456789012").first()
    assert user.mobile_number == "9998887776"
    db.close()

def test_initiate_invalid_formats():
    # Invalid account number (not 12 digits)
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "12345", "new_mobile_number": "9998887776"}
    )
    assert response.status_code == 400
    assert "Invalid account number format" in response.json()["detail"]

    # Invalid mobile number (not 10 digits)
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "123"}
    )
    assert response.status_code == 400
    assert "Invalid mobile number format" in response.json()["detail"]

def test_initiate_account_not_found():
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "999999999999", "new_mobile_number": "9998887776"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Account not found"

def test_initiate_rate_limiting():
    # First request
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9998887776"}
    )
    assert response.status_code == 200

    # Second request immediately after
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9998887776"}
    )
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["detail"]

def test_verify_invalid_otp():
    # Initiate
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9998887776"}
    )
    request_id = response.json()["request_id"]

    # Verify with wrong OTP
    response = client.post(
        "/api/v1/mobile-update/verify-old-otp",
        json={"otp": "000000", "request_id": request_id}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid OTP"

def test_verify_expired_otp():
    # Initiate
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9998887776"}
    )
    request_id = response.json()["request_id"]
    request_uuid = uuid.UUID(request_id)

    # Manually expire the OTP in the database
    db = TestingSessionLocal()
    otp_verification = db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_uuid,
        models.OTPVerification.mobile_number_type == "OLD"
    ).first()
    otp_verification.expires_at = datetime.utcnow() - timedelta(seconds=1)
    db.commit()
    db.close()

    # Verify
    response = client.post(
        "/api/v1/mobile-update/verify-old-otp",
        json={"otp": "123456", "request_id": request_id}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Expired OTP"

def test_cbs_ckyc_update_failure():
    # Initiate with the special failing number "9999999999"
    response = client.post(
        "/api/v1/mobile-update/initiate",
        json={"account_number": "123456789012", "new_mobile_number": "9999999999"}
    )
    request_id = response.json()["request_id"]
    request_uuid = uuid.UUID(request_id)

    # Get old OTP
    db = TestingSessionLocal()
    otp_verification = db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_uuid,
        models.OTPVerification.mobile_number_type == "OLD"
    ).first()
    otp_code = None
    for i in range(100000, 1000000):
        if hash_string(str(i)) == otp_verification.otp_hash:
            otp_code = str(i)
            break
    db.close()

    # Verify old OTP
    client.post(
        "/api/v1/mobile-update/verify-old-otp",
        json={"otp": otp_code, "request_id": request_id}
    )

    # Get new OTP
    db = TestingSessionLocal()
    otp_verification_new = db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_uuid,
        models.OTPVerification.mobile_number_type == "NEW"
    ).first()
    otp_code_new = None
    for i in range(100000, 1000000):
        if hash_string(str(i)) == otp_verification_new.otp_hash:
            otp_code_new = str(i)
            break
    db.close()

    # Verify new OTP (should fail CBS/CKYC update)
    response = client.post(
        "/api/v1/mobile-update/verify-new-otp",
        json={"otp": otp_code_new, "request_id": request_id}
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Failed to update CBS or CKYC"

    # Verify request status is FAILED
    response = client.get(f"/api/v1/mobile-update/status/{request_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "FAILED"
