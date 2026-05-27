
from sqlalchemy.orm import Session
from app.models.spend_alert import SpendAlert
from app.schemas.spend_alert import SpendAlertSetup
import uuid

def create_spend_alert(db: Session, *, obj_in: SpendAlertSetup, customer_id: uuid.UUID, tokenized_card_number: str):
    db_obj = SpendAlert(
        customer_id=customer_id,
        tokenized_card_number=tokenized_card_number,
        daily_spend_threshold=obj_in.daily_spend_threshold,
        alert_delivery_channel=obj_in.alert_delivery_channel,
        status="ACTIVE"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_spend_alert_by_tokenized_card(db: Session, *, tokenized_card_number: str):
    return db.query(SpendAlert).filter(SpendAlert.tokenized_card_number == tokenized_card_number).first()

def update_spend_alert_status(db: Session, *, db_obj: SpendAlert, status: str):
    db_obj.status = status
    db.commit()
    db.refresh(db_obj)
    return db_obj
