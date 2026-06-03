
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import payout_crud
from server.schemas import payout as payout_schema
from uuid import UUID

router = APIRouter()

@router.post("/batch", response_model=payout_schema.PayoutBatchInitiateResponse)
def initiate_payout_batch(payout_batch: payout_schema.PayoutBatchCreate, db: Session = Depends(get_db)):
    db_payout_batch = payout_crud.create_payout_batch(db=db, payout_batch=payout_batch)
    # TODO: Add async task for processing the batch
    return {
        "batch_id": db_payout_batch.id,
        "message": "Payout batch initiated successfully",
        "status": db_payout_batch.status
    }

@router.get("/batches", response_model=payout_schema.PayoutBatchesResponse)
def read_payout_batches(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    batches = payout_crud.get_payout_batches(db, skip=skip, limit=limit)
    return {"batches": batches, "total": len(batches)}

@router.get("/batch/{batch_id}", response_model=payout_schema.PayoutBatch)
def read_payout_batch(batch_id: UUID, db: Session = Depends(get_db)):
    db_payout_batch = payout_crud.get_payout_batch(db, batch_id=batch_id)
    if db_payout_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return db_payout_batch

@router.get("/batch/{batch_id}/transactions", response_model=payout_schema.PayoutTransactionsResponse)
def read_payout_transactions(
    batch_id: UUID, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    transactions = payout_crud.get_payout_transactions(
        db, batch_id=batch_id, skip=skip, limit=limit
    )
    return {"transactions": transactions, "total": len(transactions)}
