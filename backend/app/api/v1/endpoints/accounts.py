from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Account])
def read_accounts(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100
):
    accounts = crud.crud_account.get_accounts(db, skip=skip, limit=limit)
    return accounts


@router.post("/", response_model=schemas.Account)
def create_account(
    *, db: Session = Depends(get_db), account_in: schemas.AccountCreate
):
    account = crud.crud_account.create_account(db=db, account=account_in)
    return account


@router.get("/{account_id}", response_model=schemas.Account)
def read_account(*, db: Session = Depends(get_db), account_id: int):
    account = crud.crud_account.get_account(db=db, account_id=account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
