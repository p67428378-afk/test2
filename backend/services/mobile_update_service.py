from sqlalchemy.orm import Session
from backend.models.models import Customer, OTP
from backend.schemas import schemas
import random
import string

def initiate_update(db: Session, customer_id: str, new_mobile_number: str):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        return {"status": "FAILED", "message": "Customer not found"}

    # In a real application, you would use a proper OTP service.
    # For this example, we'll generate a random 6-digit OTP.
    otp_code = ''.join(random.choices(string.digits, k=6))
    otp_entry = OTP(customer_id=customer_id, otp=otp_code)
    db.add(otp_entry)
    db.commit()

    # In a real application, you would send the OTP via SMS.
    print(f"OTP for {customer_id} (old number): {otp_code}")

    return {"status": "OTP_SENT", "message": "OTP sent to old mobile number"}

def verify_old_otp(db: Session, customer_id: str, otp: str):
    otp_entry = db.query(OTP).filter(OTP.customer_id == customer_id, OTP.otp == otp).first()
    if not otp_entry:
        return {"status": "FAILED", "message": "Invalid OTP"}

    # In a real application, you would generate a new OTP for the new number.
    new_otp_code = ''.join(random.choices(string.digits, k=6))
    db.delete(otp_entry)
    new_otp_entry = OTP(customer_id=customer_id, otp=new_otp_code)
    db.add(new_otp_entry)
    db.commit()

    # In a real application, you would send the OTP via SMS to the new number.
    print(f"OTP for {customer_id} (new number): {new_otp_code}")

    return {"status": "OTP_VERIFIED", "message": "OTP for old number verified. OTP sent to new mobile number."}

def verify_new_otp_and_update(db: Session, customer_id: str, otp: str, new_mobile_number: str):
    otp_entry = db.query(OTP).filter(OTP.customer_id == customer_id, OTP.otp == otp).first()
    if not otp_entry:
        return {"status": "FAILED", "message": "Invalid OTP"}

    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        return {"status": "FAILED", "message": "Customer not found"}

    customer.mobile_number = new_mobile_number
    db.delete(otp_entry)
    db.commit()

    # In a real application, you would send confirmation SMS to both old and new numbers.
    print(f"Mobile number for {customer_id} updated to {new_mobile_number}")

    return {"status": "UPDATED", "message": "Mobile number updated successfully."}
