
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .... import crud, schemas
from ....database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/transfer", response_model=schemas.TransferResponse)
def transfer_funds(transfer: schemas.TransferRequest, db: Session = Depends(get_db)):
    source_account = crud.get_account(db, account_id=transfer.source_account_id)
    destination_account = crud.get_account(db, account_id=transfer.destination_account_id)

    if not source_account or not destination_account:
        raise HTTPException(status_code=404, detail="Account not found")

    if source_account.balance < transfer.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Perform the transfer
    source_account.balance -= transfer.amount
    destination_account.balance += transfer.amount

    # Create transaction records
    source_transaction = schemas.TransactionCreate(
        account_id=source_account.account_id,
        type="debit",
        amount=transfer.amount,
        description=f"Transfer to {destination_account.account_number}",
        status="completed"
    )
    dest_transaction = schemas.TransactionCreate(
        account_id=destination_account.account_id,
        type="credit",
        amount=transfer.amount,
        description=f"Transfer from {source_account.account_number}",
        status="completed"
    )

    crud.create_transaction(db=db, transaction=source_transaction, account_id=source_account.account_id)
    created_dest_transaction = crud.create_transaction(db=db, transaction=dest_transaction, account_id=destination_account.account_id)

    db.commit()

    return schemas.TransferResponse(status="success", transaction_id=created_dest_transaction.transaction_id)
