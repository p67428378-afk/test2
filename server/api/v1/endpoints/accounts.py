
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .... import crud, schemas
from ....database import SessionLocal
from uuid import UUID

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Account])
def read_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # This is a placeholder for a real user authentication system
    # In a real app, you'd get the user_id from the auth token
    user_id = UUID("00000000-0000-0000-0000-000000000000") # Placeholder
    accounts = crud.get_accounts(db, user_id=user_id, skip=skip, limit=limit)
    return accounts

@router.get("/{account_id}", response_model=schemas.Account)
def read_account(account_id: UUID, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.get("/{account_id}/balance", response_model=schemas.Account)
def read_account_balance(account_id: UUID, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.get("/{account_id}/transactions", response_model=List[schemas.Transaction])
def read_account_transactions(
    account_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    transactions = crud.get_transactions(db, account_id=account_id, skip=skip, limit=limit)
    return transactions
