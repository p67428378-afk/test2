from sqlalchemy.orm import Session
from server import models, schemas
from typing import List, Optional
import uuid

# Existing Password Reset CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    db_otp = models.OTP(user_id=user_uuid, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    otp_uuid = uuid.UUID(otp_session_id) if isinstance(otp_session_id, str) else otp_session_id
    return db.query(models.OTP).filter(models.OTP.id == otp_uuid).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    db_password_history = models.PasswordHistory(user_id=user_uuid, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# New Balance Inquiry & Audit CRUD
def get_account(db: Session, account_id: str) -> Optional[models.Account]:
    try:
        acc_uuid = uuid.UUID(account_id) if isinstance(account_id, str) else account_id
    except ValueError:
        return None
    return db.query(models.Account).filter(models.Account.id == acc_uuid).first()

def get_accounts_by_user(db: Session, user_id: str) -> List[models.Account]:
    try:
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    except ValueError:
        return []
    return db.query(models.Account).filter(models.Account.user_id == user_uuid).all()

def create_audit_log(db: Session, user_id: str, account_id: str, event_type: str = "BALANCE_INQUIRY", details: Optional[str] = None) -> models.AuditLog:
    user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    acc_uuid = uuid.UUID(account_id) if isinstance(account_id, str) else account_id
    db_log = models.AuditLog(
        user_id=user_uuid,
        account_id=acc_uuid,
        event_type=event_type,
        details=details
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_audit_logs_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 20) -> List[models.AuditLog]:
    try:
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    except ValueError:
        return []
    return db.query(models.AuditLog).filter(models.AuditLog.user_id == user_uuid).order_by(models.AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

def get_transactions_by_account(db: Session, account_id: str, skip: int = 0, limit: int = 20) -> List[models.Transaction]:
    try:
        acc_uuid = uuid.UUID(account_id) if isinstance(account_id, str) else account_id
    except ValueError:
        return []
    return db.query(models.Transaction).filter(models.Transaction.account_id == acc_uuid).order_by(models.Transaction.timestamp.desc()).offset(skip).limit(limit).all()
