from sqlalchemy.orm import Session
from .. import models, schemas
import uuid

def get_accounts(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.account.Account).filter(models.account.Account.user_id == user_id).offset(skip).limit(limit).all()

def create_user_account(db: Session, account: schemas.account.AccountCreate, user_id: str):
    db_account = models.account.Account(**account.dict(), user_id=user_id, id=str(uuid.uuid4()))
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account
