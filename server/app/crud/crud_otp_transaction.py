
from sqlalchemy.orm import Session
from app.models.otp_transaction import OtpTransaction
from app.schemas.spend_alert import SpendAlertSetup
from datetime import datetime, timedelta
import uuid

def create_otp_transaction(db: Session, *, obj_in: SpendAlertSetup, tokenized_card_number: str, otp_hash: str):
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    db_obj = OtpTransaction(
        tokenized_card_number=tokenized_card_number,
        daily_spend_threshold=obj_in.daily_spend_threshold,
        alert_delivery_channel=obj_in.alert_delivery_channel,
        otp_hash=otp_hash,
        expires_at=expires_at
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_otp_transaction(db: Session, *, transaction_id: uuid.UUID):
    return db.query(OtpTransaction).filter(OtpTransaction.transaction_id == transaction_id).first()

def delete_otp_transaction(db: Session, *, db_obj: OtpTransaction):
    db.delete(db_obj)
    db.commit()
