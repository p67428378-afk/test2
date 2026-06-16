from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, models, dependencies

router = APIRouter()

@router.get("/{account_id}/transactions", response_model=List[schemas.Transaction])
def read_transactions(
    account_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    account = crud.get_account(db, account_id=account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")
    transactions = crud.get_transactions_by_account_id(db, account_id=account_id, skip=skip, limit=limit)
    return transactions
