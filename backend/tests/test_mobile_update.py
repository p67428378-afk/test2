from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.models import Customer, OTP
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def test_client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)

def test_initiate_mobile_number_update(test_client, db_session):
    # Create a dummy customer
    customer = Customer(customer_id="CUST12345", mobile_number="9988776655", hashed_password="testpassword")
    db_session.add(customer)
    db_session.commit()

    response = test_client.post("/mobile-update/initiate", json={"customer_id": "CUST12345", "new_mobile_number": "9876543210"})
    assert response.status_code == 200
    assert response.json() == {"status": "OTP_SENT", "message": "OTP sent to old mobile number"}

    # Verify OTP is stored in the database
    otp_entry = db_session.query(OTP).filter(OTP.customer_id == "CUST12345").first()
    assert otp_entry is not None
    assert len(otp_entry.otp) == 6

def test_verify_old_otp(test_client, db_session):
    # Create a dummy customer and OTP
    customer = Customer(customer_id="CUST12345", mobile_number="9988776655", hashed_password="testpassword")
    otp = OTP(customer_id="CUST12345", otp="123456")
    db_session.add(customer)
    db_session.add(otp)
    db_session.commit()

    response = test_client.post("/mobile-update/verify-old-otp", json={"customer_id": "CUST12345", "otp": "123456"})
    assert response.status_code == 200
    assert response.json() == {"status": "OTP_VERIFIED", "message": "OTP for old number verified. OTP sent to new mobile number."}

def test_verify_new_otp_and_update(test_client, db_session):
    # Create a dummy customer and OTP for the new number
    customer = Customer(customer_id="CUST12345", mobile_number="9988776655", hashed_password="testpassword")
    otp = OTP(customer_id="CUST12345", otp="654321") # OTP for new number
    db_session.add(customer)
    db_session.add(otp)
    db_session.commit()

    response = test_client.post("/mobile-update/verify-new-otp", json={"customer_id": "CUST12345", "otp": "654321", "new_mobile_number": "9876543210"})
    assert response.status_code == 200
    assert response.json() == {"status": "UPDATED", "message": "Mobile number updated successfully."}

    # Verify the mobile number is updated in the database
    updated_customer = db_session.query(Customer).filter(Customer.customer_id == "CUST12345").first()
    assert updated_customer.mobile_number == "9876543210"
