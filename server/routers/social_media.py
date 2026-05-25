from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.post("/social-media-accounts", response_model=schemas.SocialMediaAccount)
def connect_social_media_account(account: schemas.SocialMediaAccountCreate, db: Session = Depends(get_db)):
    # In a real app, you'd get the influencer_id from the authenticated user
    influencer_id = uuid.uuid4()
    return crud.create_social_media_account(db=db, account=account, influencer_id=influencer_id)

@router.delete("/social-media-accounts/{account_id}")
def disconnect_social_media_account(account_id: uuid.UUID, db: Session = Depends(get_db)):
    db_account = crud.delete_social_media_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Social media account not found")
    return {"ok": True}
