"""Payment tracking and deposit transaction endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from server.crud import get_payments, process_payment
from server.database import get_db
from server.schemas import PaymentCreate, PaymentOut

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


@router.get("", response_model=List[PaymentOut])
def list_payments(
    session_id: Optional[str] = Query(None, description="Filter by session ID"),
    db: Session = Depends(get_db),
):
    return get_payments(db, session_id=session_id)


@router.post("", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def make_payment(pmt_in: PaymentCreate, db: Session = Depends(get_db)):
    return process_payment(db, pmt_in)
