
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import services, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)

@router.post("/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return services.create_transaction(db=db, transaction=transaction)

@router.get("/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = services.get_transactions(db, skip=skip, limit=limit)
    return transactions

@router.get("/{transaction_id}", response_model=schemas.Transaction)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = services.get_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.patch("/{transaction_id}", response_model=schemas.Transaction)
def update_transaction_status(
    transaction_id: int,
    transaction_update: schemas.TransactionUpdate,
    db: Session = Depends(get_db)
):
    db_transaction = services.update_transaction(
        db, transaction_id=transaction_id, transaction_update=transaction_update
    )
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction
