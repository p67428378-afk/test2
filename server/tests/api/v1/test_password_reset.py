
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.app.db.session import get_db
from server.app.models.password_reset import Base, User, OTP, PasswordResetAttempt
from passlib.context import CryptContext
import uuid
from datetime import datetime, timedelta

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Delete the test database if it exists
if os.path.exists("./test.db"):
    os.remove("./test.db")

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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test data
TEST_USER_LOGIN_ID = "testuser"
TEST_USER_MOBILE = "1234567890"
TEST_USER_PASSWORD = "oldpassword"
TEST_SECURITY_QUESTION = "What was the make of your first car?"
TEST_SECURITY_ANSWER = "toyota"

def create_test_user(db):
    # Clean up previous test data
    db.query(OTP).delete()
    db.query(PasswordResetAttempt).delete()
    db.query(User).delete()
    db.commit()

    user = User(
        login_id=TEST_USER_LOGIN_ID,
        registered_mobile_number=TEST_USER_MOBILE,
        password_hash=pwd_context.hash(TEST_USER_PASSWORD),
        security_question=TEST_SECURITY_QUESTION,
        security_answer_hash=pwd_context.hash(TEST_SECURITY_ANSWER)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_initiate_password_reset():
    db = TestingSessionLocal()
    create_test_user(db)
    response = client.post("/api/v1/password-reset/initiate", json={"login_id": TEST_USER_LOGIN_ID, "mobile_number": TEST_USER_MOBILE})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OTP_SENT"
    db.close()

def test_verify_otp_and_security_question():
    db = TestingSessionLocal()
    user = create_test_user(db)
    otp_code = "123456"
    otp_hash = pwd_context.hash(otp_code)
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    otp_obj = OTP(user_id=user.id, otp_code_hash=otp_hash, expires_at=expires_at)
    db.add(otp_obj)
    db.commit()

    # Verify OTP
    response = client.post("/api/v1/password-reset/verify-otp", json={"login_id": TEST_USER_LOGIN_ID, "otp": otp_code})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OTP_VERIFIED"
    assert data["security_question"] == TEST_SECURITY_QUESTION

    # Verify Security Question
    response = client.post("/api/v1/password-reset/verify-security-question", json={"login_id": TEST_USER_LOGIN_ID, "answer": TEST_SECURITY_ANSWER})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED_SUCCESS"
    assert "reset_token" in data
    db.close()

def test_set_new_password():
    db = TestingSessionLocal()
    user = create_test_user(db)
    reset_token = str(uuid.uuid4())
    token_expires_at = datetime.utcnow() + timedelta(minutes=10)
    attempt = PasswordResetAttempt(user_id=user.id, reset_token=reset_token, token_expires_at=token_expires_at, status="VERIFIED")
    db.add(attempt)
    db.commit()

    new_password = "newValidPassword123!"
    response = client.post("/api/v1/password-reset/set-password", json={
        "login_id": TEST_USER_LOGIN_ID,
        "reset_token": reset_token,
        "new_password": new_password
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RESET_SUCCESSFUL"
    assert data["login_link"] == "/login"

    db.refresh(user)
    assert pwd_context.verify(new_password, user.password_hash)
    db.close()
