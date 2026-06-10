from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID

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

# Fund Transfer CRUD
def get_account(db: Session, account_id: UUID):
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def create_account(db: Session, user_id: UUID, balance: float, currency: str = "USD"):
    db_account = models.Account(user_id=user_id, balance=balance, currency=currency)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_transaction(db: Session, transaction_id: UUID):
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

def create_transaction(db: Session, source_account_id: UUID, destination_account_id: UUID, amount: float, status: str = "PENDING"):
    db_transaction = models.Transaction(
        source_account_id=source_account_id,
        destination_account_id=destination_account_id,
        amount=amount,
        status=status
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def update_transaction_status(db: Session, transaction: models.Transaction, status: str):
    transaction.status = status
    db.commit()
    db.refresh(transaction)
    return transaction
