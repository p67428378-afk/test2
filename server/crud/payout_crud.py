
from sqlalchemy.orm import Session
from server.models.payout_batch import PayoutBatch
from server.models.payout_transaction import PayoutTransaction
from server.schemas.payout import PayoutBatchCreate
from uuid import UUID

def create_payout_batch(db: Session, payout_batch: PayoutBatchCreate):
    db_payout_batch = PayoutBatch(status="PENDING")
    db.add(db_payout_batch)
    db.commit()
    db.refresh(db_payout_batch)
    return db_payout_batch

def get_payout_batch(db: Session, batch_id: UUID):
    return db.query(PayoutBatch).filter(PayoutBatch.id == batch_id).first()

def get_payout_batches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PayoutBatch).offset(skip).limit(limit).all()

def get_payout_transactions(db: Session, batch_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(PayoutTransaction).filter(PayoutTransaction.batch_id == batch_id).offset(skip).limit(limit).all()
