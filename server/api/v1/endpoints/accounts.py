from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/accounts", response_model=List[schemas.AccountResponse])
def get_accounts(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accounts = crud.get_accounts_by_user_id(db, current_user.id)
    return accounts

@router.get("/accounts/{accountId}", response_model=schemas.AccountResponse)
def get_account(
    accountId: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = crud.get_account_by_id(db, accountId)
    if not account or account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    return account
