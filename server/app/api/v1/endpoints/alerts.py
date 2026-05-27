
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.spend_alert import SpendAlertSetup, SpendAlertSetupResponse, SpendAlertVerification, SpendAlertStatus
from app.crud import crud_otp_transaction, crud_spend_alert
from app.services import otp_service, cms_service, security_service
from app.db.session import TestingSessionLocal
from datetime import datetime
import uuid

router = APIRouter()

def get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/setup", response_model=SpendAlertSetupResponse)
def setup_alert(alert_setup: SpendAlertSetup, db: Session = Depends(get_db)):
    tokenized_card = security_service.tokenize_card_number(alert_setup.card_number)
    otp = otp_service.generate_otp()
    otp_hash = security_service.get_password_hash(otp)

    # In a real app, we would look up the customer's contact info
    # For simulation, we'll use a placeholder
    customer_contact = "user@example.com" 
    if not otp_service.send_otp(customer_contact, otp):
        raise HTTPException(status_code=500, detail="Failed to send OTP")

    transaction = crud_otp_transaction.create_otp_transaction(
        db=db,
        obj_in=alert_setup,
        tokenized_card_number=tokenized_card,
        otp_hash=otp_hash
    )

    return {"message": "OTP sent successfully to registered contact.", "transaction_id": transaction.transaction_id}

@router.post("/verify", response_model=SpendAlertStatus)
def verify_alert(verification: SpendAlertVerification, db: Session = Depends(get_db)):
    transaction = crud_otp_transaction.get_otp_transaction(db=db, transaction_id=verification.transaction_id)

    if not transaction or transaction.expires_at < datetime.utcnow():
        raise HTTPException(status_code=404, detail="Transaction not found or has expired")

    if not security_service.verify_password(verification.otp_code, transaction.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # In a real app, we'd get the customer_id from the user's session
    customer_id = uuid.uuid4()

    if not cms_service.register_alert_with_cms(
        tokenized_card_number=transaction.tokenized_card_number,
        daily_spend_threshold=transaction.daily_spend_threshold,
        alert_delivery_channel=transaction.alert_delivery_channel
    ):
        raise HTTPException(status_code=500, detail="Failed to register alert with CMS")

    spend_alert = crud_spend_alert.get_spend_alert_by_tokenized_card(db=db, tokenized_card_number=transaction.tokenized_card_number)
    if spend_alert:
        crud_spend_alert.update_spend_alert_status(db=db, db_obj=spend_alert, status="ACTIVE")
    else:
        alert_setup = SpendAlertSetup(
            card_number="", # Not needed here
            daily_spend_threshold=transaction.daily_spend_threshold,
            alert_delivery_channel=transaction.alert_delivery_channel
        )
        crud_spend_alert.create_spend_alert(
            db=db, 
            obj_in=alert_setup, 
            customer_id=customer_id, 
            tokenized_card_number=transaction.tokenized_card_number
        )

    crud_otp_transaction.delete_otp_transaction(db=db, db_obj=transaction)

    return {
        "status": "ACTIVE",
        "threshold_amount": transaction.daily_spend_threshold,
        "alert_delivery_channel": transaction.alert_delivery_channel
    }
