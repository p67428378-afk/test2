from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from server import models, schemas
from datetime import datetime, time
from uuid import UUID
from typing import Optional

# Existing CRUD functions
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# New Banking Module CRUD functions

def get_account_by_id(db: Session, account_id: UUID):
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def get_account_by_number(db: Session, account_number: str):
    return db.query(models.Account).filter(models.Account.account_number == account_number).first()

def get_accounts_by_user_id(db: Session, user_id: UUID):
    return db.query(models.Account).filter(models.Account.user_id == user_id).all()

def create_account(db: Session, user_id: UUID, account_number: str, account_type: str, balance: float):
    db_account = models.Account(
        user_id=user_id,
        account_number=account_number,
        account_type=account_type,
        balance=balance
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def create_transaction(db: Session, from_account_id: UUID, to_account_id: UUID, amount: float, type: str, memo: Optional[str] = None):
    db_transaction = models.Transaction(
        from_account_id=from_account_id,
        to_account_id=to_account_id,
        amount=amount,
        type=type,
        memo=memo
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_p2p_transfers_total_today(db: Session, user_id: UUID) -> float:
    # Get all accounts of the user
    user_accounts = db.query(models.Account.id).filter(models.Account.user_id == user_id).all()
    user_account_ids = [acc.id for acc in user_accounts]
    if not user_account_ids:
        return 0.0

    # Start of today (UTC)
    today_start = datetime.combine(datetime.utcnow().date(), time.min)

    # Sum P2P transfers from user's accounts today
    total = db.query(func.sum(models.Transaction.amount)).filter(
        and_(
            models.Transaction.from_account_id.in_(user_account_ids),
            models.Transaction.type == "P2P Transfer",
            models.Transaction.created_at >= today_start
        )
    ).scalar()

    return float(total) if total else 0.0
