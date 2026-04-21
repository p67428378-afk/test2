from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..schemas import account as account_schema
from ..services import account_service, user_service
from ..core.database import get_db

router = APIRouter()

@router.post("/users/{user_id}/accounts/", response_model=account_schema.Account)
def create_account_for_user(
    user_id: str, account: account_schema.AccountCreate, db: Session = Depends(get_db)
):
    db_user = user_service.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return account_service.create_user_account(db=db, account=account, user_id=user_id)


@router.get("/users/{user_id}/accounts/", response_model=List[account_schema.Account])
def read_user_accounts(
    user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    db_user = user_service.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    accounts = account_service.get_accounts(db, user_id=user_id, skip=skip, limit=limit)
    return accounts
