
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.SocialMediaAccount)
def connect_social_media_account(account: schemas.SocialMediaAccountCreate, db: Session = Depends(get_db)):
    # In a real application, this would involve an OAuth flow
    # and secure storage of tokens.
    # For this example, we'll just create a dummy account.
    db_account = crud.create_social_media_account(db=db, account=account)
    return db_account

@router.delete("/{account_id}")
def disconnect_social_media_account(account_id: uuid.UUID, db: Session = Depends(get_db)):
    db_account = crud.delete_social_media_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Social media account not found")
    return {"ok": True}
