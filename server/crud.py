
from sqlalchemy.orm import Session
from . import models, schemas
from uuid import UUID

def get_user(db: Session, user_id: UUID):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # In a real application, you would hash the password here
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_accounts(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Account).filter(models.Account.user_id == user_id).offset(skip).limit(limit).all()

def get_account(db: Session, account_id: UUID):
    return db.query(models.Account).filter(models.Account.account_id == account_id).first()

def create_transaction(db: Session, transaction: schemas.TransactionCreate, account_id: UUID):
    db_transaction = models.Transaction(**transaction.dict(), account_id=account_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session, account_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).filter(models.Transaction.account_id == account_id).offset(skip).limit(limit).all()
