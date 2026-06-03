from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import payout_crud
from server.schemas.payout import PayoutBatchCreate, PayoutBatchResponse, PayoutBatchesResponse, PayoutBatchDetails, PayoutTransactionsResponse
import uuid

router = APIRouter()

@router.post("/batch", response_model=PayoutBatchResponse)
def create_payout_batch(payout_batch: PayoutBatchCreate, db: Session = Depends(get_db)):
    db_payout_batch = payout_crud.create_payout_batch(db=db, payout_batch=payout_batch)
    return {"batch_id": db_payout_batch.id, "message": "Payout batch initiated successfully", "status": db_payout_batch.status}

@router.get("/batches", response_model=PayoutBatchesResponse)
def read_payout_batches(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    batches = payout_crud.get_payout_batches(db, skip=skip, limit=limit)
    total = payout_crud.count_payout_batches(db)
    return {"batches": batches, "total": total}

@router.get("/batch/{batch_id}", response_model=PayoutBatchDetails)
def read_payout_batch(batch_id: uuid.UUID, db: Session = Depends(get_db)):
    db_payout_batch = payout_crud.get_payout_batch(db, batch_id=batch_id)
    if db_payout_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return db_payout_batch

@router.get("/batch/{batch_id}/transactions", response_model=PayoutTransactionsResponse)
def read_payout_transactions(batch_id: uuid.UUID, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    db_payout_batch = payout_crud.get_payout_batch(db, batch_id=batch_id)
    if db_payout_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    transactions = payout_crud.get_payout_transactions(db, batch_id=batch_id, skip=skip, limit=limit)
    total = payout_crud.count_payout_transactions(db, batch_id=batch_id)
    return {"transactions": transactions, "total": total}
