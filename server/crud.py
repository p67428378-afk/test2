from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_accounts_by_user_id(db: Session, user_id: str):
    return db.query(models.Account).filter(models.Account.user_id == user_id).all()

def get_transactions_by_account_id(db: Session, account_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).filter(models.Transaction.account_id == account_id).offset(skip).limit(limit).all()

def create_transfer(db: Session, transfer: schemas.TransferCreate, from_account: models.Account, to_account: models.Account):
    db_transfer = models.Transfer(**transfer.dict(), status="completed")
    from_account.balance -= transfer.amount
    to_account.balance += transfer.amount
    db.add(db_transfer)
    db.commit()
    db.refresh(db_transfer)
    return db_transfer

def get_account(db: Session, account_id: str):
    return db.query(models.Account).filter(models.Account.id == account_id).first()
