from sqlalchemy.orm import Session
from . import models, schemas

def get_linked_account(db: Session, checking_account_id: str):
    return db.query(models.LinkedAccount).filter(models.LinkedAccount.checking_account_id == checking_account_id).first()

def create_linked_account(db: Session, linked_account: schemas.LinkedAccountCreate):
    db_linked_account = models.LinkedAccount(**linked_account.model_dump())
    db.add(db_linked_account)
    db.commit()
    db.refresh(db_linked_account)
    return db_linked_account

def update_linked_account_status(db: Session, checking_account_id: str, is_enabled: bool):
    db_linked_account = get_linked_account(db, checking_account_id)
    if db_linked_account:
        db_linked_account.is_enabled = is_enabled
        db.commit()
        db.refresh(db_linked_account)
    return db_linked_account

def delete_linked_account(db: Session, checking_account_id: str):
    db_linked_account = get_linked_account(db, checking_account_id)
    if db_linked_account:
        db.delete(db_linked_account)
        db.commit()
    return db_linked_account

def create_overdraft_transfer_event(db: Session, event: schemas.OverdraftTransferEventCreate):
    db_event = models.OverdraftTransferEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_overdraft_transfer_events(db: Session, checking_account_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.OverdraftTransferEvent).filter(models.OverdraftTransferEvent.checking_account_id == checking_account_id).offset(skip).limit(limit).all()

def create_notification_log(db: Session, log: schemas.NotificationLogCreate):
    db_log = models.NotificationLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# In a real application, UserNotificationPreferences would be stored in the DB.
# For this exercise, we'll simulate it in memory per customer_id.
_notification_preferences_store = {}

def get_notification_preferences(customer_id: str):
    return _notification_preferences_store.get(customer_id, schemas.UserNotificationPreferences(customer_id=customer_id, email_enabled=True, sms_enabled=False))

def update_notification_preferences(customer_id: str, preferences: schemas.NotificationPreferenceUpdate):
    current_prefs = get_notification_preferences(customer_id)
    if preferences.email_enabled is not None:
        current_prefs.email_enabled = preferences.email_enabled
    if preferences.sms_enabled is not None:
        current_prefs.sms_enabled = preferences.sms_enabled
    _notification_preferences_store[customer_id] = current_prefs
    return current_prefs
